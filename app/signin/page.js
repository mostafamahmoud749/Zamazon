"use client";
import Input from "@/components/auth/Input";
import Form from "@/components/auth/Form";
import Button from "@/components/auth/Button";
import { useState } from "react";
import SigninWithGithub from "@/components/auth/SigninWithGithub";
import SigninWithGoogle from "@/components/auth/SigninWithGoogle";

export default function Home() {
  const [radio, setRadio] = useState(true);
  function toggle(selected) {
    if (!selected) setRadio((prev) => !prev);
  }
  
  return (
    <main className="m-auto md:mt-6 max-w-[400px] bg-white w-full border-gray-200 border-1 rounded-md shadow-sm ">
      <Form
        selected={radio}
        toggle={toggle}
        text="Create account"
        textq="New to Zamazon?"
      >
        <div className="mx-4">
          <Input type="text" label="First and last name" />
          <Input type="email" label="Mobile number or email" />
          <Input type="password" label="Create a password" />
          <Button />
        </div>
      </Form>

      <Form
        selected={!radio}
        toggle={toggle}
        text="Sign in"
        textq="Already a customer?"
      >
        <div className="mx-4">
          <Input type="email" label="Email or phone number" />
        <div className="flex flex-col gap-3 mb-4">
          <SigninWithGithub />
          <SigninWithGoogle />
        </div>
          <Button />
        </div>
      </Form>
    </main>
  );
}
