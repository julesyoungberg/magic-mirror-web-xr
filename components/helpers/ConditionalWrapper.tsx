import { ReactElement } from "react";

type Props = React.PropsWithChildren<{
  predicate: boolean;
  wrapper: (children: React.ReactNode) => ReactElement;
}>;

export default function ConditionalWrapper({
  children,
  predicate,
  wrapper,
}: Props) {
  if (predicate) {
    return wrapper(children);
  }

  return children;
}
