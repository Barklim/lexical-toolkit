import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import { TagsType, TagType, TagGroupType } from '../../types';
import { filterMapper } from '../../functions';
import { allPrefixes, tagGroups } from '../../constant';

type ModalTagSelectorPropsType = {
  tags: TagsType;
  limitTagCodes?: string[];
};

export const ModalTagSelector = forwardRef<any, ModalTagSelectorPropsType>(({ tags, limitTagCodes = [] }, ref) => {
  const [show, setShow] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<(value: TagType) => void | null>(null as any);
  const [rejectPromise, setRejectPromise] = useState<() => void | null>(null as any);

  useEffect(
    () => () => {
      setResolvePromise(null as any);
      setRejectPromise(null as any);
    },
    [],
  );

  useImperativeHandle(ref, () => ({
    open: () => {
      setShow(true);
      return new Promise<TagType>((resolve, reject) => {
        setResolvePromise(() => resolve);
        setRejectPromise(() => reject);
      });
    },
  }));

  const ok = useCallback(
    (tag: TagType) => {
      setShow(false);
      if (resolvePromise) resolvePromise(tag);
    },
    [resolvePromise],
  );

  const cancel = useCallback(() => {
    setShow(false);
    if (rejectPromise) rejectPromise();
  }, [rejectPromise]);

  const renderTags = useCallback(
    (tagGroup: TagGroupType) => {
      const mappedLimitTagCodes = limitTagCodes?.map((item) => `{{ ${item} }}`) ?? [];

      return (
        <div className="margin-bottom">
          <div className="control-label">{tagGroup.label}</div>
          {tags
            .filter((tag) => {
              let properPrefix;
              if (tagGroup.prefix) {
                properPrefix = tag.code.startsWith(filterMapper(tagGroup.prefix));
              } else {
                properPrefix = !tag.code.match(allPrefixes);
              }
              return properPrefix && (!mappedLimitTagCodes.length || mappedLimitTagCodes.includes(tag.code));
            })
            .map((tag) => (
              <div className="small" key={tag.code}>
                <a onClick={() => ok(tag)}>{tag.name.substring(3, tag.name.length - 3)}</a>
              </div>
            ))}
        </div>
      );
    },
    [tags, limitTagCodes, ok],
  );

  return (
    <Modal show={show} onHide={cancel} bsSize="large" backdrop="static" className="test">
      <div>
        <Modal.Header closeButton>
          <Modal.Title>Library of email parameters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-xs-3">
              {renderTags(tagGroups.hrAgent)}
              {renderTags(tagGroups.company)}
              {renderTags(tagGroups.other)}
            </div>
            <div className="col-xs-3">{renderTags(tagGroups.candidate)}</div>
            <div className="col-xs-3">{renderTags(tagGroups.contact)}</div>
            <div className="col-xs-3">{renderTags(tagGroups.job)}</div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
});
