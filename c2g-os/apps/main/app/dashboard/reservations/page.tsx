import { getAvailableItemsForReservation, getDepositRates, getMyReservations } from "./actions";
import ReservationsClient from "./reservations-client";
import { getSecureWalletBalance } from "../wallet/shared-actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Shipment Reservations | C2G Logistics',
  description: 'Group your warehouse packages and orders into a shipment reservation.',
};

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const [availableItems, depositRates, myReservations, walletRes] = await Promise.all([
    getAvailableItemsForReservation(),
    getDepositRates(),
    getMyReservations(),
    getSecureWalletBalance(),
  ]);

  const walletBalance = walletRes.available_balance || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Shipment Reservations</h1>
        <p className="text-muted-foreground">
          Select items from your warehouse to reserve space in our upcoming air or sea shipments.
        </p>
      </div>
      
      <ReservationsClient 
        availableItems={availableItems} 
        depositRates={depositRates} 
        reservations={myReservations}
        walletBalance={walletBalance} 
      />
    </div>
  );
}
