

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { useFormContext } from "react-hook-form";



interface InputFormProps {

  label: string;

  name: string;

  placeholder?: string;

  description?: string;

  type?: string;

  required?: boolean;

}



export const InputForm = ({

  label,

  name,

  placeholder,

  description,

  type = "text",

  required,

}: InputFormProps) => {

  const form = useFormContext();



  return (

    <FormField

      control={form.control}

      name={name}

      render={({ field }) => (

        <FormItem>

          <FormLabel>

            {label}

            {required && "*"}

          </FormLabel>

          <FormControl>

            <Input placeholder={placeholder} type={type} {...field} />

          </FormControl>

          <FormDescription>{description}</FormDescription>

          <FormMessage />

        </FormItem>

      )}

    />

  );

};
