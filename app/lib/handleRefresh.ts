import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const handleRefresh = async () => {
  "use server";

  const headersList = await headers();
  const pathname = headersList.get("x-current-path");
  revalidatePath(pathname || "");
};

export default handleRefresh;
