import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { Modal } from "../shared/Modal";

import { useCreateQuestion } from "@/hooks/question_bank/useCreateQuestion";
import { usePutQuestion } from "@/hooks/question_bank/usePutQuestion";
import type { QuestionBank } from "@/types/questionBank";
import {
  questionDifficulties,
  questionKeys,
  questionTypes,
} from "@/utils/questionBank";
import {
  questionBankSchema,
  type QuestionBankFormData,
} from "@/validation/questionBankSchema";
import clsx from "clsx";
import { Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import HookFormInput from "../forms/HookFormInput";
import HookFormSelect from "../forms/HookFormSelect";

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: (QuestionBank & { id: number }) | undefined;
}

export const QuestionBankFormModal = ({
  isOpen,
  onClose,
  initialValues,
}: TeacherFormModalProps) => {
  const createMutation = useCreateQuestion();
  const updateMutation = usePutQuestion();

  const form = useForm<QuestionBankFormData>({
    resolver: zodResolver(questionBankSchema) as Resolver<QuestionBankFormData>,
    mode: "onChange",

    defaultValues: {
      difficulty: "easy",
      type: "essay",
      title: "",
      options: undefined,
      correct_answer: undefined,
    },
  });

  const errors = form.formState.errors;

  const questionBankType = useWatch({
    control: form.control,
    name: "type",
  });

  const correctAnswer = useWatch({
    control: form.control,
    name: "correct_answer",
  });

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  function onQuestionTypeChange(type: string) {
    remove();
    if (type === "mcq" || type === "true_false") {
      form.setValue("correct_answer", "");
      append([
        {
          option: type === "true_false" ? "صح" : "",
        },
        {
          option: type === "true_false" ? "خطأ" : "",
        },
      ]);
    } else {
      form.setValue("correct_answer", undefined);
    }
  }

  function onCloseHandler() {
    onClose();
    form.reset();
  }

  const onSubmitHandler = async (data: QuestionBankFormData) => {
    if (questionBankType === "essay" || questionBankType === "short_answer") {
      delete data.options;
    } else {
      data.options?.map((option, index) => {
        option["key"] = questionKeys[index];
      });
      data.correct_answer = questionKeys[+(correctAnswer || 0)];
    }

    if (initialValues) {
      updateMutation.mutate(
        {
          id: initialValues.id,
          ...data,
        },
        {
          onSuccess: () => {
            onCloseHandler();
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onCloseHandler();
        },
      });
    }
  };

  useEffect(() => {
    if (initialValues) {
      //  set initial values
      const formData: QuestionBankFormData = {
        ...initialValues,
      };
      formData.correct_answer = formData.options
        ?.findIndex((option) => option.key === initialValues.correct_answer)
        .toFixed();

      form.reset(formData);
    } else {
      form.reset();
    }
  }, [form, initialValues]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  function addNewOption() {
    const newKey = questionKeys[fields.length];
    if (!newKey) return;

    append({
      option: "",
    });
    form.setValue("correct_answer", "");
  }

  function removeOption(index: number) {
    remove(index);

    form.setValue("correct_answer", "");
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseHandler}
      containerClassName="sm:min-w-[600px]"
    >
      <FormProvider {...form} key={initialValues?.id}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)}>
          <div className="grid grid-cols-1 gap-4">
            <HookFormInput
              label="صيغة السؤال"
              name="title"
              placeholder="ادخل السؤال"
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <HookFormSelect
                label="نوع السؤال"
                name="type"
                required
                options={questionTypes}
                onChange={(value) => {
                  onQuestionTypeChange(value);
                }}
                placeholder="اختر نوع السؤال"
              />

              <HookFormSelect
                label="مستوى السؤال"
                name="difficulty"
                required
                options={questionDifficulties}
                placeholder="اختر مستوى السؤال"
              />
            </div>

            {questionBankType === "mcq" && (
              <>
                <div className="space-y-8">
                  <div className="flex items-center justify-between gap-4">
                    <p>الاختيارات</p>

                    <button
                      onClick={addNewOption}
                      disabled={fields.length >= 6}
                      type="button"
                      className="flex cursor-pointer items-center space-x-2 rounded-lg border border-black px-4 py-2 font-medium transition-colors hover:border-emerald-700 hover:bg-emerald-700 hover:text-white"
                    >
                      <span>
                        <Plus className="size-4" />
                      </span>
                      <span> اضف خيار</span>
                    </button>
                  </div>

                  {fields.map((field, index) => (
                    <div className="flex items-center gap-4" key={field.id}>
                      <input
                        type="radio"
                        {...form.register("correct_answer")}
                        className={clsx("radio radio-success h-4 w-4", {
                          "radio-error!":
                            errors.correct_answer?.message && !correctAnswer,
                        })}
                        value={index}
                      />

                      <HookFormInput
                        name={`options.${index}.option`}
                        placeholder="ادخل الخيار"
                        required
                        containerClassName="!m-0"
                      />

                      {fields.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                        >
                          <Trash className="size-[18px] text-red-600" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {questionBankType === "true_false" && (
              <>
                <div className="space-y-8">
                  <div className="flex items-center justify-between gap-4">
                    <p>الاختيارات</p>
                  </div>

                  {fields.map((field, index) => (
                    <div className="flex items-center gap-4" key={field.id}>
                      <input
                        type="radio"
                        {...form.register("correct_answer")}
                        className={clsx("radio radio-success h-4 w-4", {
                          "radio-error!":
                            errors.correct_answer?.message && !correctAnswer,
                        })}
                        value={`${index}`}
                      />

                      <p>{field.option}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {}
            {/* <HookFormInput
              label="البريد الالكتروني"
              name="email"
              placeholder="ادخل البريد الالكترونى"
              required
            />
            <HookFormInput
              label="رقم الهاتف"
              name="phone"
              placeholder="رقم الهاتف"
            />

            <HookFormMultiSelect
              label="الفصول"
              name="class_ids"
              disabled={!selectedBranchs.length}
              options={classesOptions}
              placeholder="اختر الفصل"
            /> */}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCloseHandler}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {
                console.log(form);
              }}
              className="btn-primary"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  جاري الحفظ...
                </span>
              ) : initialValues ? (
                "حفظ"
              ) : (
                "اضافة"
              )}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
