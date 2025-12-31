import Radio from "@/components/auth/Radio";

export default function Form({ selected, toggle, children, text, textq }) {
  return (
    <>
      <Radio selected={selected} toggle={toggle} text={text} textq={textq} />
      {selected ? children : null}
    </>
  );
}
