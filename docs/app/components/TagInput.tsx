// Type:
type TagInputPropsType = {
  value: any;
  setValue: any;
};

// Libraries:
import { useReducer, useRef } from "react";
import { Tag, TagCloseButton } from "@chakra-ui/react";

// Tags:
export default function TagInput(props: TagInputPropsType) {
  // Manage Values:
  // const { value: TagsArray, setValue: SetTagsArray } = props;
  const SaveTagsArray = (oldVal: any, newVal: any) => {
    props.setValue(newVal);
    return newVal;
  };
  const [TagsArray, SetTagsArray] = useReducer(SaveTagsArray, props.value);

  // Input Ref:
  const InputRef = useRef<HTMLInputElement>(null);

  // Focus Input on Div Click:
  const focusInput = (e?: any) => {
    if (InputRef.current === null) return;
    if (!e) InputRef.current.focus();
    else if (e.target.tagName !== "SPAN") InputRef.current.focus();
  };

  // Save Tag:
  const saveTagAndHide = (e: any) => {
    if (InputRef.current === null) return;
    saveTag();
    InputRef.current.blur();
    // InputRef.current.style.display = "none";
  };
  const saveTagOnEnter = (e: any) => {
    if (e.key === "Enter") {
      saveTag();
      focusInput();
    }
  };
  const saveTag = () => {
    if (InputRef.current === null) return;
    const Tag = InputRef.current?.value.trim();
    if (Tag === "") return;
    const NewTagsArray = [...TagsArray, Tag];
    InputRef.current.value = "";
    SetTagsArray([...NewTagsArray]);
  };

  // Remove Tag:
  const removeTag = (tagIndex: number) => {
    const NewTagsArray = TagsArray;
    console.log("TagsArray = ", TagsArray);
    NewTagsArray.splice(tagIndex, 1);
    SetTagsArray([...NewTagsArray]);
  };

  // Render:
  return (
    <div className="relative" onClick={focusInput}>
      {TagsArray.map((tag: string, index: number) => {
        return (
          <Tag
            key={index}
            my={0.5}
            mx={1}
            py={1}
            px={4}
            size="md"
            rounded="full"
            colorScheme="blue"
          >
            {tag}
            <TagCloseButton onClick={() => removeTag(index)} />
          </Tag>
        );
      })}
      <input
        ref={InputRef}
        // tabIndex={10}
        onBlur={saveTagAndHide}
        onKeyUp={saveTagOnEnter}
        className="inline w-0 focus:px-2 focus:py-1 focus:w-1/3 focus:bg-red-00 outline-none"
      />
    </div>
  );
}
