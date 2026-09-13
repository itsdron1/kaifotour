import { notFound } from "next/navigation";

/** Любой неизвестный адрес под /en получает оформленную страницу 404 внутри английского layout */
export default function UnknownRoute() {
  notFound();
}
