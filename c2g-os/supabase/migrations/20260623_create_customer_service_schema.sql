-- Customer Service Schema (Phase 1)
-- support_tickets, ticket_messages, customer_notes, escalations

-- 1. Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL, -- e.g., TKT-10042
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'Package Missing', 'Order Delay'
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'escalated', 'closed')),
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- the agent
    sla_deadline TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON public.support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON public.support_tickets(assigned_to);

-- 2. Ticket Messages (Conversations)
CREATE TABLE IF NOT EXISTS public.ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Can be agent or customer
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('customer', 'agent', 'system')),
    channel VARCHAR(50) DEFAULT 'internal' CHECK (channel IN ('internal', 'whatsapp', 'email', 'chat')),
    content TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT FALSE, -- If true, customer cannot see this message
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);

-- 3. Customer Notes (Agent Internal Notes on a Customer Profile)
CREATE TABLE IF NOT EXISTS public.customer_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    note_content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_notes_customer_id ON public.customer_notes(customer_id);

-- 4. Escalations
CREATE TABLE IF NOT EXISTS public.escalations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    escalated_by UUID NOT NULL REFERENCES auth.users(id), -- the agent
    escalated_to_department VARCHAR(100) NOT NULL CHECK (escalated_to_department IN ('Procurement', 'China Warehouse', 'Ghana Operations', 'Finance', 'Technical', 'Management')),
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'resolved', 'rejected')),
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escalations_ticket_id ON public.escalations(ticket_id);

-- 5. Trigger to auto-update ticket updated_at
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ticket_timestamp
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION update_ticket_timestamp();

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalations ENABLE ROW LEVEL SECURITY;

-- Add basic read/write policies for authenticated users (In a real app, restrict by role using staff_role)
CREATE POLICY "Enable read access for all authenticated users" ON public.support_tickets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for all authenticated users" ON public.support_tickets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for all authenticated users" ON public.support_tickets FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.ticket_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for all authenticated users" ON public.ticket_messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for all authenticated users" ON public.ticket_messages FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.customer_notes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for all authenticated users" ON public.customer_notes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for all authenticated users" ON public.customer_notes FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.escalations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for all authenticated users" ON public.escalations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for all authenticated users" ON public.escalations FOR UPDATE USING (auth.role() = 'authenticated');
