import { useAuthStore } from "@/stores/auth";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import HookFormInput from "../forms/HookFormInput";
import HookFormSelect from "../forms/HookFormSelect";
import { Plus } from "lucide-react";
import { useGetClassesByBranchs } from "@/hooks/classes/useGetClassesByBranchs";
import { ExamStatus, type ExamCreate } from "@/types/exams";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSchema } from "@/validation/examSchema";
import type z from "zod";
import { useGetQuestions } from "@/hooks/question_bank/useGetQuestions";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableQuestionItem } from "./SortableQuestionItem";
import { useCreateExam } from "@/hooks/Exams/useCreateExam";

type FormData = z.infer<typeof examSchema>;

export default function CreateExam({
  setActiveMood,
}: {
  setActiveMood: (mood: "view" | "edit" | "add") => void;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(examSchema) as Resolver<FormData>,
    defaultValues: {
      questions: [
        {
          question_id: "",
          marks: 1,
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const questions = useWatch({
    control: form.control,
    name: "questions",
  });

  const { data, isPending } = useGetQuestions();

  const createExamMutation = useCreateExam();

  const onSubmit = (data: FormData) => {
    const examData: ExamCreate = {
      ...data,
    };
    examData.questions = data.questions.map((question, index) => ({
      ...question,
      order: index,
    }));
    createExamMutation.mutate(examData, {
      onSuccess: () => {},
    });
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
    }
  }

  const activeBranch = useAuthStore((state) => state.activeBranch);
  const { classes } = useGetClassesByBranchs([activeBranch?.id || ""]);

  const classesOptions =
    classes?.map((cls) => ({
      value: `${cls.id}`,
      label: cls.name,
    })) || [];

  const questionOptions =
    data?.map((q) => ({
      value: `${q.id}`,
      label: q.title,
    })) || [];

  return (
    <div className="w-full p-6">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col gap-12">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              اضافة امتحان
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              الفرع: {activeBranch?.name}
            </p>
          </div>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <HookFormInput
                  label="عنوان الامتحان"
                  name="title"
                  placeholder="ادخل عنوان الامتحان"
                  type="text"
                  required
                />
                <HookFormInput
                  label="وقت الامتحان (بالدقائق)"
                  name="duration_minutes"
                  placeholder="ادخل وقت الامتحان بالدقائق"
                  type="number"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <HookFormInput
                  label="تاريخ بداية الامتحان"
                  name="start_time"
                  placeholder="قم بأختيار التاريخ"
                  type="date"
                  required
                />

                <HookFormInput
                  label="تاريخ نهاية الامتحان"
                  name="end_time"
                  placeholder="قم بأختيار التاريخ"
                  type="date"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <HookFormSelect
                  label="الفصل"
                  name="class_id"
                  disabled={!activeBranch?.id}
                  options={classesOptions}
                  placeholder="اختر الفصل"
                  required
                />
              </div>

              <div className="mb-4 flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <p>اسئلة الامتحان</p>
                  {questions?.length > 0 && (
                    <p className="text-sm">
                      ( الدرجة النهائية للامتحان{" : "}
                      {questions?.length &&
                        questions.reduce(
                          (acc, curr) => acc + +curr.marks,
                          0,
                        )}{" "}
                      )
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => append({ question_id: "", marks: 1 })}
                  className="flex cursor-pointer items-center space-x-2 rounded-lg border border-gray-400 px-4 py-2 font-medium transition-colors hover:bg-emerald-700 hover:text-white"
                >
                  <span>
                    <Plus className="size-3" />
                  </span>
                  <span className="text-sm">اضف سؤال</span>
                </button>
              </div>

              <div className="space-y-4">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={fields.map((field) => field.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {fields.map((field, index) => {
                      return (
                        <SortableQuestionItem
                          key={field.id}
                          id={field.id}
                          index={index}
                          remove={remove}
                          questionOptions={questionOptions}
                          isPending={isPending}
                          totalItems={fields.length}
                          examStatus={ExamStatus.DRAFT}
                        />
                      );
                    })}
                  </SortableContext>
                </DndContext>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    className="rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={createExamMutation.isPending}
                  >
                    {createExamMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                        >
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
                    ) : (
                      "اضافة"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMood("view")}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    رجوع
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
