// Supabase Configuration
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://quhvblahkpwxdurcuahx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1aHZibGFoa3B3eGR1cmN1YWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NDQ3OTcsImV4cCI6MjA2NTMyMDc5N30.Eg_s-CUIvtlzRZcZwJGp6Ipn6uWK9FctcN914p89hTU'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Make it globally accessible
window.supabase = supabase

export default supabase
