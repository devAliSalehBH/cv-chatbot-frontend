import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div>
        <Button variant="outline">{t("title")}</Button>
      </div>
    </div>
  );
}
