import Radio from '@/components/auth/Radio';
import { AuthProps } from '@/types/auth';
import { ReactNode } from 'react';

type AuthSectionProps = {
  children: ReactNode;
} & AuthProps;

export default function AuthSection({ selected, toggle, children, text, textq }: AuthSectionProps) {
  return (
    <>
      <Radio selected={selected} toggle={toggle} text={text} textq={textq} />
      {selected ? children : null}
    </>
  );
}
