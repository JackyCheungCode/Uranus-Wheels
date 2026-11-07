create index if not exists wheel_enquiry_messages_sender_user_idx
  on public.wheel_enquiry_messages(sender_user_id)
  where sender_user_id is not null;