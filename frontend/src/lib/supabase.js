import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xrytnuhucuqmyoytdtch.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyeXRudWh1Y3VxbXlveXRkdGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNjExMTYsImV4cCI6MjEwNTkzNzExNn0.r_JnE5MEeNT-sCzOgmBtz-TAP-gar-ST85E14GuDm-I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
