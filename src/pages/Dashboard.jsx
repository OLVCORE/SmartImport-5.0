import React from 'react'
import { useSimulationStore } from '../store/simulationStore'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Ship, 
  Plane, 
  Truck,
  MapPin,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Users,
  Target,
  Award
} from 'lucide-react'

console.log('[SmartImport] Dashboard.jsx montando (store + hook)')

const Dashboard = () => {
  const { getCustomsRegimes } = useSimulationStore()
  const regimes = getCustomsRegimes ? getCustomsRegimes() : []
  return (
    <div style={{fontSize: 24, padding: 40}}>
      Dashboard<br/>
      <div>Regimes disponíveis:</div>
      <pre style={{fontSize: 16, background: '#f3f4f6', padding: 12, borderRadius: 8}}>{JSON.stringify(regimes, null, 2)}</pre>
    </div>
  )
}

export default Dashboard 