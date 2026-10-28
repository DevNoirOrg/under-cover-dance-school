"use client";

import { useState } from "react";
import { saveFormOptions } from "@/app/actions/admin";
import {
  Button,
  Card,
  IconButton,
  LangTabs,
  PageHeader,
  SaveBar,
  TrText,
  countMissing,
  isSame,
  useSaver,
  type EditLang,
} from "@/components/admin/ui";
import type { EditInfo } from "@/lib/admin-data";
import type { FormOptions } from "@/lib/content-types";

/*
  A „Táncoltál már korábban?” opciói, magyarul és angolul. Az angol felirat
  az angol oldalon látszik, de a jelentkezésbe mindig a magyar szöveg kerül
  (így az admin és az export egységes).
*/
type Row = { hu: string; en: string };
const toRows = (o: FormOptions): Row[] => o.experience.map((hu, i) => ({ hu, en: o.experienceEn?.[i] ?? "" }));
const toOptions = (rows: Row[]): FormOptions => ({ experience: rows.map((r) => r.hu), experienceEn: rows.map((r) => r.en) });

export default function FormOptionsEditor({ initial, info }: { initial: FormOptions; info: EditInfo }) {
  const [saved, setSaved] = useState<Row[]>(() => toRows(initial));
  const [rows, setRows] = useState<Row[]>(() => toRows(initial));
  const [lang, setLang] = useState<EditLang>("hu");
  const { pending, status, save } = useSaver();
  const isEn = lang === "en";

  const setRow = (i: number, patch: Partial<Row>) => setRows((p) => p.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const move = (i: number, d: -1 | 1) =>
    setRows((p) => {
      const next = [...p];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return next;
    });

  return (
    <div>
      <PageHeader title="Form opciók" description="A jelentkezési form legördülő mezőjének választási lehetőségei.">
        <LangTabs lang={lang} onChange={setLang} missing={countMissing(rows.map((r) => [r.hu, r.en]))} />
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2">
        <Card
          title="Táncoltál már korábban?"
          description={
            isEn
              ? "Az angol oldalon ez a felirat látszik; a jelentkezésbe a magyar változat kerül."
              : "A mező nem kötelező; a jelentkező üresen is hagyhatja."
          }
        >
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <TrText ariaLabel="Opció" lang={lang} hu={r.hu} en={r.en} onHu={(x) => setRow(i, { hu: x })} onEn={(x) => setRow(i, { en: x })} />
                {!isEn && (
                  <>
                    <IconButton label="Feljebb" onClick={() => move(i, -1)} disabled={i === 0}>
                      ↑
                    </IconButton>
                    <IconButton label="Lejjebb" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>
                      ↓
                    </IconButton>
                    <IconButton
                      label="Törlés"
                      onClick={() => setRows((p) => p.filter((_, j) => j !== i))}
                      className="hover:!bg-red-50 hover:!text-red-600"
                    >
                      ✕
                    </IconButton>
                  </>
                )}
              </div>
            ))}
            {rows.length < 12 && !isEn && (
              <Button variant="ghost" onClick={() => setRows((p) => [...p, { hu: "", en: "" }])}>
                + Új opció
              </Button>
            )}
          </div>
        </Card>
      </div>
      <SaveBar
        dirty={!isSame(rows, saved)}
        pending={pending}
        status={status}
        info={info}
        onReset={() => setRows(saved)}
        onSave={() => save(() => saveFormOptions(toOptions(rows)), undefined, () => setSaved(rows))}
      />
    </div>
  );
}
