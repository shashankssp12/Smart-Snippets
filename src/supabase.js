
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnjkwqgzqtemqwilhblu.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuamt3cWd6cXRlbXF3aWxoYmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA5NDg2NDIsImV4cCI6MjAwNjUyNDY0Mn0.WSvekxcfDqRWTrR3b5abN7You5rqcFRX8MDHhKmN8cU";
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;