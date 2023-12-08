import { forwardRef } from "react";
import { FieldError } from "react-hook-form";

type FormInputProps = {
  label: string;
  name: string;
  id: string;
  type?: "text" | "number";
  error?: FieldError;
};

const FormInput = forwardRef<HTMLInputElement, FormInputProps>((props, ref) => {
  return (
    <div className="my-3">
      <p className="text-white">{props.label}</p>
      <input
        ref={ref}
        {...props}
        id={props.id}
        className="block max-w-[20rem] w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      {props.error && (
        <p className="text-red-700 text-lg">{props.error.message}</p>
      )}
    </div>
  );
});

export default FormInput;
