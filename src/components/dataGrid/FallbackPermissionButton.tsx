const FallbackPermissionButton = ({ reason }: { reason: string }) => {
  return (
    <div className="cursor-not-allowed px-4 py-2 text-center text-sm text-gray-500">
      لا تمتلك الصلاحية {reason}
    </div>
  );
};

export default FallbackPermissionButton;
