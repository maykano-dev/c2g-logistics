// Dedicated layout for the payment status page — inherits root providers
// but suppresses the global footer for a clean, focused confirmation UI.
export default function PaymentStatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
