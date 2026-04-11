import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kipphnwyaezxeplpkgac.supabase.co';
const supabaseAnonKey = 'sb_publishable_8a3bLb5Ing9oJeYtL7vJMw_htibS1wL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
