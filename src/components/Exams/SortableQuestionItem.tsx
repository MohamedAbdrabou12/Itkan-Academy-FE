import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash } from "lucide-react";
import HookFormSelect from "../forms/HookFormSelect";
import HookFormInput from "../forms/HookFormInput";
import { ExamStatus } from "@/types/exams";

export function SortableQuestionItem({
  id,
  index,
  questionOptions,
  isPending,
  remove,
  totalItems,
  examStatus,
}: {
  id: string;
  index: number;
  questionOptions: { value: string; label: string }[];
  isPending: boolean;
  remove: (index: number) => void;
  totalItems: number;
  examStatus: ExamStatus | undefined;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex w-full items-start gap-2"
    >
      <div className="flex items-center justify-center self-center">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab"
        >
          <GripVertical />
        </button>
      </div>
      <div className="flex-1">
        <HookFormSelect
          label="السؤال"
          name={`questions.${index}.question_id`}
          options={questionOptions}
          disabled={isPending}
          placeholder="اختر السؤال"
          className="mb-4!"
          required
          enableSearch
        />
      </div>
      <div className="col-span-2">
        <HookFormInput
          label="الدرجة"
          name={`questions.${index}.marks`}
          placeholder="ادخل درجة السؤال"
          type="number"
          required
        />
      </div>
      {totalItems > 1 && examStatus === ExamStatus.DRAFT && (
        <div className="flex items-center self-center">
          <button
            type="button"
            onClick={() => remove(index)}
            className="cursor-pointer"
          >
            <Trash className="size-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
