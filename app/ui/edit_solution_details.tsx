"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@components/ui/card";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from "@components/ui/form";
import clsx from "clsx";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { SquareX, SquarePlus } from "lucide-react";

const formSchema = z.object({
  solutionData: z.array(
    z.object({
      key: z.string().trim().min(1, { message: "Data key cannot be empty." }),
    })
  ),
});

const EditSolutionDetails = ({
  solutionData,
  handleSubmit,
}: {
  solutionData: string;
  handleSubmit: (payload: { [key: string]: string | number }) => void;
}): JSX.Element => {
  const parsedSolutionData: { [key: string]: string | number } =
    React.useMemo(() => {
      if (!solutionData) {
        return {};
      }
      return JSON.parse(solutionData);
    }, [solutionData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      solutionData: Object.keys(parsedSolutionData).map((key) => ({ key })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "solutionData",
  });

  const handleDeleteDataField = (key: string, idx: number): void => {
    remove(idx);
  };

  const handleAddNewDataField = (): void => {
    append({ key: "" });
  };

  const submitUpdatedSolutionData = (
    data: z.infer<typeof formSchema>
  ): void => {
    const payload = data.solutionData.reduce(
      (acc, curr) => ((acc[curr.key] = 0), acc),
      {}
    );

    handleSubmit(payload);
  };

  return (
    <Card className={clsx("p-4 w-full")}>
      <CardHeader>
        <CardTitle>Data</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitUpdatedSolutionData)}>
          <CardContent>
            <div className={clsx("flex flex-col gap-2 mb-2")}>
              {fields.map((field, idx) => (
                <React.Fragment key={`${idx}`}>
                  <FormLabel>Soluation Data Field {idx + 1}</FormLabel>
                  <div className={clsx("flex flex-row items-end gap-2")}>
                    <FormField
                      control={form.control}
                      name={`solutionData.${idx}`}
                      render={() => (
                        <FormItem className={clsx("w-full")}>
                          <FormControl>
                            <Input
                              placeholder="key"
                              {...form.register(`solutionData.${idx}.key`)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Input
                      placeholder="value"
                      disabled
                      // value={parsedSolutionData[key] || ""}
                      value=""
                    />
                    <Button
                      variant="destructive"
                      className={clsx("w-40")}
                      size="icon"
                      onClick={() => handleDeleteDataField("", idx)}
                    >
                      <SquareX />
                    </Button>
                  </div>
                </React.Fragment>
              ))}
            </div>
            {fields.length === 0 && (
              <p className={clsx("italic text-sm text-muted-foreground mb-2")}>
                This solution does not yet have any stored data.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddNewDataField}
            >
              <SquarePlus />
            </Button>
            <Button type="submit">Save</Button>
          </CardFooter>
          {/* <DevTool control={form.control} /> */}
        </form>
      </Form>
    </Card>
  );
};

export default EditSolutionDetails;
