// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cvrbwpgpqxydkhmklutl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cmJ3cGdwcXh5ZGtobWtsdXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MDE2OTAsImV4cCI6MjA1NjI3NzY5MH0.cz5zZEnKC-sd-UBx7fAk0sGnU5OLFOR6xY1ghnTqCxQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);