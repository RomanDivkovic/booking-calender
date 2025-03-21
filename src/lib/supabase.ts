import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohxvkoqdzaqobbwndvrf.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeHZrb3FkemFxb2Jid25kdnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDUyMzIsImV4cCI6MjA1ODEyMTIzMn0.MZlQdnZCl2Bu8znPWoK4nEYt4Z2GnxORj08nQq1h5Y8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
