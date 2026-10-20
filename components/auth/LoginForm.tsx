'use client';

import Input from '@/components/auth/Input';
import Button from '@/components/common/Button';
import SigninWithGithub from '@/components/auth/SigninWithGithub';
import SigninWithGoogle from '@/components/auth/SigninWithGoogle';

type LoginFormProps = {
  callbackUrl: string;
};

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  return (
    <form className="mx-4">
      <Input type="email" label="Email or phone number" name="" />
      <div className="mb-4 flex flex-col gap-3">
        <SigninWithGithub />
        <SigninWithGoogle callbackUrl={callbackUrl} />
      </div>
      <Button
        color="bg-amber-300"
        hoverdColor="hover:bg-amber-400"
        padding="p-2"
        margin="mb-4"
        rounded="rounded-2xl"
      >
        continue
      </Button>
    </form>
  );
}
