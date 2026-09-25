import { notFound } from "next/navigation";

/** Любой неизвестный адрес получает оформленную страницу 404 внутри индонезийского layout */
export default function UnknownRoute() {
  notFound();
}
