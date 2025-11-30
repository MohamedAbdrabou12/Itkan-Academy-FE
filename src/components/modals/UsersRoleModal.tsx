import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { useGetAllRoles } from "@/hooks/roles/useGetAllRoles";
import type { FormComponents, FormField } from "@/types/Forms";
import { UserRole } from "@/types/Roles";
import type { StaffDetails } from "@/types/users";
import {
  userRolesApiSchema,
  userRolesFormSchema,
  type UserRolesApiData,
  type UserRolesFormData,
} from "@/validation/userRoleSchema";
import { FormTextArea } from "../forms/FormTextArea";
import Spinner from "../shared/Spinner";
import { GenericFormModal } from "./GenericFormModal";

interface UsersRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserRolesApiData) => Promise<void>;
  user: StaffDetails;
  isSubmitting?: boolean;
  closeOnBackdropClick?: boolean;
}

export const UsersRoleModal = (props: UsersRoleModalProps) => {
  const { allRoles, isPending: rolesLoading } = useGetAllRoles();

  const getInitialData = () => {
    return {
      full_name: props.user.full_name,
      role_id: props.user.role_id?.toString(),
    };
  };

  // Filter out student role and transform to options
  const roleOptions =
    allRoles?.items
      ?.filter(
        (role) =>
          role.name !== UserRole.STUDENT && role.name !== UserRole.TEACHER,
      )
      .map((role) => ({
        value: role.id.toString(),
        label: role.name_ar,
      })) || [];

  const userRolesFields: FormField[] = [
    {
      name: "full_name",
      label: "اسم المستخدم",
      type: "text",
      required: false,
      disabled: true,
    },
    {
      name: "role_id",
      label: "الدور الرئيسي",
      type: "select",
      required: true,
      options: roleOptions,
    },
  ];

  const handleFormSubmit = async (formData: UserRolesFormData) => {
    // Convert form data (strings) to API data (numbers)
    const apiData: UserRolesApiData = {
      user_id: props.user.id, // Already a number from props
      role_id: parseInt(formData.role_id, 10), // Convert string to number
    };

    // Validate the API data
    try {
      userRolesApiSchema.parse(apiData);
      await props.onSubmit(apiData);
    } catch (error) {
      console.error("API data validation failed:", error);
    }
  };

  if (rolesLoading) {
    return <Spinner />;
  }

  return (
    <GenericFormModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleFormSubmit}
      schema={userRolesFormSchema}
      fields={userRolesFields}
      title="تعديل دور المستخدم"
      description="قم بتعديل الدور الرئيسي للمستخدم."
      submitButtonText="إضافة دور"
      editingSubmitButtonText="تحديث الدور"
      formComponents={formComponents}
      initialData={getInitialData()}
      isSubmitting={props.isSubmitting}
      isEditing={true}
      closeOnBackdropClick={props.closeOnBackdropClick}
    />
  );
};

const formComponents: FormComponents = {
  Input: FormInput,
  TextArea: FormTextArea,
  Select: FormSelect,
};
