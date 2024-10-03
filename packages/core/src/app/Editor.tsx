import { $getRoot } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import * as React from "react";
import { useEffect, useState } from "react";

// import { getEmailTags, logError } from '../shared/functions';

import { CAN_USE_DOM } from "../shared/canUseDOM";
import { useSettings } from "../context/SettingsContext";
import { useSharedHistoryContext } from "../context/SharedHistoryContext";
import { ActionsPlugin } from "../plugins/ActionsPlugin";
import { AutocompletePlugin } from "../plugins/AutocompletePlugin";
import { AutoEmbedPlugin } from "../plugins/AutoEmbedPlugin";
import { LexicalAutoLinkPlugin as AutoLinkPlugin } from "../plugins/AutoLinkPlugin";
import { CodeActionMenuPlugin } from "../plugins/CodeActionMenuPlugin";
import { CodeHighlightPlugin } from "../plugins/CodeHighlightPlugin";
import { CollapsiblePlugin } from "../plugins/CollapsiblePlugin";
import { ComponentPickerMenuPlugin as ComponentPickerPlugin } from "../plugins/ComponentPickerPlugin";
import { ContextMenuPlugin } from "../plugins/ContextMenuPlugin";
import { DragDropPaste } from "../plugins/DragDropPastePlugin";
import { DraggableBlockPlugin } from "../plugins/DraggableBlockPlugin";
import { EmojiPickerPlugin } from "../plugins/EmojiPickerPlugin";
import { EmojisPlugin } from "../plugins/EmojisPlugin";
import { EquationsPlugin } from "../plugins/EquationsPlugin";
import { FigmaPlugin } from "../plugins/FigmaPlugin";
import { FloatingLinkEditorPlugin } from "../plugins/FloatingLinkEditorPlugin";
import { FloatingTextFormatToolbarPlugin } from "../plugins/FloatingTextFormatToolbarPlugin";
import { ImagesPlugin } from "../plugins/ImagesPlugin";
import { InlineImagePlugin } from "../plugins/InlineImagePlugin";
import { KeywordsPlugin } from "../plugins/KeywordsPlugin";
import { LayoutPlugin } from "../plugins/LayoutPlugin/LayoutPlugin";
import { LinkPlugin } from "../plugins/LinkPlugin";
import { ListMaxIndentLevelPlugin } from "../plugins/ListMaxIndentLevelPlugin";
import { MarkdownPlugin as MarkdownShortcutPlugin } from "../plugins/MarkdownShortcutPlugin";
import { MaxLengthPlugin } from "../plugins/MaxLengthPlugin";
import { NewMentionsPlugin as MentionsPlugin } from "../plugins/MentionsPlugin";
import { PageBreakPlugin } from "../plugins/PageBreakPlugin";
import { PollPlugin } from "../plugins/PollPlugin";
import SpeechToTextPlugin from "../plugins/SpeechToTextPlugin";
import { TabFocusPlugin } from "../plugins/TabFocusPlugin";
import { ToolbarPlugin } from "../plugins/ToolbarPlugin";
import { TreeViewPlugin } from "../plugins/TreeViewPlugin";
import { TwitterPlugin } from "../plugins/TwitterPlugin";
import { YouTubePlugin } from "../plugins/YouTubePlugin";
import { InsertHTMLPlugin } from "../plugins/InsertHTMLPlugin";
import { MustachePlugin } from "../plugins/MustachePlugin";
import { MustachePickerPlugin } from "../plugins/MustachePickerPlugin";
import { MentionHint } from "../plugins/MentionHint";
import { LexicalContentEditable as ContentEditable } from "../ui/ContentEditable";
import { LexicalEditorPropsType, TagsType } from "../types";

export const Editor = (props: LexicalEditorPropsType): JSX.Element => {
  const {
    html,
    inputMode,
    isRichText,
    placeholder,
    treeViewMode,
    tagsSelector,
    limitTagCodes,
    initialValues,
    onChange,
  } = props;
  const { historyState } = useSharedHistoryContext();
  const {
    settings: {
      isCollab,
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      shouldUseLexicalContextMenu,
      shouldPreserveNewLinesInMarkdown,
    },
  } = useSettings();
  const isEditable = useLexicalEditable();
  const placeholderValue =
    // placeholder || window.translate("Type something here...");
    placeholder;
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [tags, setTags] = useState<TagsType>([]);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        // const fetchedTags = await getEmailTags();
        // setTags(fetchedTags);
        setTags([]);
      } catch (error) {
        // logError(`Failed to fetch email tags:`, { error });
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  const handleChange = React.useCallback(() => {
    const transformContent = (content: string) => {
      let transformed = content;
      const matches = content.match(/{{(.*?)}}/g) || [];
      matches.forEach((match) => {
        const strippedMatch = match.replace("{{", "").replace("}}", "").trim();
        const extendedMatch = `{{ ${strippedMatch} }}`;
        const foundTag = tags.find((tag) => tag.name === extendedMatch);
        if (foundTag) {
          transformed = transformed.replace(
            new RegExp(extendedMatch, "g"),
            foundTag.code,
          );
        }
      });
      return transformed;
    };

    editor.update(() => {
      const textContent = editor
        .getEditorState()
        .read(() => $getRoot().getTextContent());
      if (inputMode) {
        onChange && onChange(transformContent(textContent));
      } else {
        const htmlContent = $generateHtmlFromNodes(editor, null);
        onChange && onChange(transformContent(htmlContent));
      }
    });
  }, [editor, inputMode, onChange, tags]);

  return (
    <>
      <InsertHTMLPlugin
        initialValues={initialValues}
        isPlainText={inputMode || false}
        html={html}
      />
      <OnChangePlugin onChange={handleChange} />

      {isRichText && <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />}
      <div
        className={`editor-container ${treeViewMode ? "tree-view" : ""} ${!isRichText ? "plain-text" : ""}`}
      >
        {isMaxLength && <MaxLengthPlugin maxLength={30} />}
        <DragDropPaste />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <EmojiPickerPlugin />
        <AutoEmbedPlugin />

        <MentionsPlugin />
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        <SpeechToTextPlugin />
        <AutoLinkPlugin />
        {isRichText ? (
          <>
            {isCollab ? (
              <div>123</div>
            ) : (
              <HistoryPlugin externalHistoryState={historyState} />
            )}
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div className="editor" ref={onRef}>
                    <ContentEditable
                      placeholder={placeholderValue || ''}
                      inputMode={inputMode}
                    />
                  </div>
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <MarkdownShortcutPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <ComponentPickerPlugin />
            <ImagesPlugin />
            <InlineImagePlugin />
            <LinkPlugin />
            <PollPlugin />
            <TwitterPlugin />
            <YouTubePlugin />
            <FigmaPlugin />
            <ClickableLinkPlugin disabled={isEditable} />
            <HorizontalRulePlugin />
            <EquationsPlugin />
            <TabFocusPlugin />
            <TabIndentationPlugin />
            <CollapsiblePlugin />
            <PageBreakPlugin />
            <LayoutPlugin />
            {floatingAnchorElem && !isSmallWidthViewport && (
              <>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin
                  anchorElem={floatingAnchorElem}
                  isLinkEditMode={isLinkEditMode}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
              </>
            )}
          </>
        ) : (
          <>
            <PlainTextPlugin
              contentEditable={
                <ContentEditable
                  placeholder={placeholderValue || ''}
                  inputMode={inputMode}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </>
        )}
        {(isCharLimit || isCharLimitUtf8) && (
          <CharacterLimitPlugin
            charset={isCharLimit ? "UTF-16" : "UTF-8"}
            maxLength={5}
          />
        )}
        {isAutocomplete && <AutocompletePlugin />}
        {shouldUseLexicalContextMenu && <ContextMenuPlugin />}
        {isRichText && (
          <ActionsPlugin
            isRichText={isRichText}
            shouldPreserveNewLinesInMarkdown={shouldPreserveNewLinesInMarkdown}
          />
        )}
        {tagsSelector && (
          <>
            <MustachePlugin tags={tags} />
            <MustachePickerPlugin tags={tags} />
            <MentionHint limitTagCodes={limitTagCodes} tags={tags} />
          </>
        )}
      </div>
      {treeViewMode && <TreeViewPlugin />}
    </>
  );
};
