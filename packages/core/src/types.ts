// import { emailTemplateEditorModes } from 'shared/constants';

export type LexicalEditorPropsType = {
  // editorMode?: typeof emailTemplateEditorModes;
  editorMode?: string;
  name?: string;
  html?: string;
  placeholder?: string;
  treeViewMode?: boolean;
  debugMode?: boolean;
  inputMode?: boolean;
  isRichText?: boolean;
  tagsSelector?: boolean;
  limitTagCodes?: string[];
  initialValues?: any;
  onFocus?: any;
  onBlur?: any;
  onChange?: (arg: string) => void;
};

export type TagType = {
  name: string;
  code: string;
};

export type TagsType = TagType[];

export type TagGroupType = {
  label: string;
  prefix?: string;
};
