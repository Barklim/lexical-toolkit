import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode } from 'lexical';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createMustacheNode } from '../../nodes/MustacheNode';
import { TagsType } from '../../types';

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = `\\b[A-Z][^\\s${PUNCTUATION}]`;

const DocumentMustachesRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMustachesRegex.PUNCTUATION;
const VALID_CHARS = `[^${PUNC}\\s]`;
const VALID_JOINS = `(?:\\.[ |$]| |[${PUNC}]|)`;
const LENGTH_LIMIT = 75;

const AtSignMustachesRegex = new RegExp(
  `(^|\\s|\\()(\\{\\{\\s*((?:${VALID_CHARS}${VALID_JOINS}){0,${LENGTH_LIMIT}}))$`,
);
const ALIAS_LENGTH_LIMIT = 50;
const AtSignMustachesRegexAliasRegex = new RegExp(
  `(^|\\s|\\()(\\{\\{\\s*((?:${VALID_CHARS}){0,${ALIAS_LENGTH_LIMIT}}))$`,
);
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const mustachesCache = new Map();

function useMustacheLookupService(mustacheString: string | null, tags: TagsType) {
  const [results, setResults] = useState<Array<string>>([]);

  useEffect(() => {
    const cachedResults = mustachesCache.get(mustacheString);

    if (mustacheString == null) {
      setResults([]);
      return;
    }

    if (cachedResults === null) {
      return;
    } else if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    mustachesCache.set(mustacheString, null);
    const tagCodes = tags.map((tag) => tag.name);
    const filteredResults = tagCodes.filter((mustache) =>
      mustache.toLowerCase().includes(mustacheString.toLowerCase()),
    );
    mustachesCache.set(mustacheString, filteredResults);
    setResults(filteredResults);
  }, [mustacheString, tags]);

  return results;
}

function checkForAtSignMustaches(text: string): MenuTextMatch | null {
  let match = AtSignMustachesRegex.exec(text);

  if (match === null) {
    match = AtSignMustachesRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    const maybeLeadingWhitespace = match[1];
    const matchingString = match[3];
    return {
      leadOffset: match.index + maybeLeadingWhitespace.length,
      matchingString,
      replaceableString: match[2],
    };
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMustaches(text);
}

class MustacheTypeaheadOption extends MenuOption {
  name: string;

  constructor(name: string) {
    super(name);
    this.name = name;
  }
}

function MustachesTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MustacheTypeaheadOption;
}) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={`typeahead-item-${index}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="text">{option.name}</span>
    </li>
  );
}

export type MustachePickerPluginPropsType = {
  tags: TagsType;
};

export const MustachePickerPlugin = ({ tags }: MustachePickerPluginPropsType) => {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const results = useMustacheLookupService(queryString, tags);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(
    () => results.map((result) => new MustacheTypeaheadOption(result)).slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results],
  );

  const onSelectOption = useCallback(
    (selectedOption: MustacheTypeaheadOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
      if (nodeToReplace) {
        editor.update(() => {
          const mustacheNode = createMustacheNode(selectedOption.name);
          nodeToReplace.replace(mustacheNode);
          mustacheNode.select();
          closeMenu();
        });
      }
    },
    [editor],
  );

  const checkForMustacheMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MustacheTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMustacheMatch}
      options={options}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div className="typeahead-popover mentions-menu">
                <ul>
                  {options.map((option, i: number) => (
                    <MustachesTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current,
            )
          : null
      }
    />
  );
};
