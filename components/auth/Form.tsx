import Radio from '@/components/auth/Radio';
import { AuthProps } from '@/types/auth';
import { ReactNode } from 'react';

type FormProps = {
  children: ReactNode;
} & AuthProps;

export default function Form({ selected, toggle, children, text, textq }: FormProps) {
  return (
    <>
      <Radio selected={selected} toggle={toggle} text={text} textq={textq} />
      {selected ? children : null}
    </>
  );
}
