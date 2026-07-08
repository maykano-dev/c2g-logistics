import { createClient } from "@/utils/supabase/server";
import { Activity, Server, AlertTriangle, Clock, Zap } from "lucide-react";

export const metadata = {
  title: "API Monitoring | C2G Admin",
};

export default async function ApiMonitoringPage() {
  const supabase = await createClient();

  // Fetch API Health Logs (last 100)
  const { data: logs, error } = await supabase
    .from("api_health_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  // Calculate Metrics
  const totalRequests = logs?.length || 0;
  const errorCount = logs?.filter(l => l.status_code >= 400 || l.error_message).length || 0;
  const successRate = totalRequests > 0 ? ((totalRequests - errorCount) / totalRequests) * 100 : 100;
  
  const avgLatency = totalRequests > 0 
    ? logs?.reduce((sum, l) => sum + (l.latency_ms || 0), 0)! / totalRequests 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8 text-indigo-500" />
            Smart Gateway Health
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring for the Alibaba Dropshipping API connection.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 border-l-4 border-l-indigo-500 rounded-l-none">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Server className="w-4 h-4" />
            <h3 className="font-bold text-sm">Status</h3>
          </div>
          <p className="text-2xl font-bold text-green-500 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            Operational
          </p>
        </div>

        <div className="glass-panel p-5 border-l-4 border-l-blue-500 rounded-l-none">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Zap className="w-4 h-4" />
            <h3 className="font-bold text-sm">Success Rate (Last 100)</h3>
          </div>
          <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
        </div>

        <div className="glass-panel p-5 border-l-4 border-l-orange-500 rounded-l-none">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <h3 className="font-bold text-sm">Avg Latency</h3>
          </div>
          <p className="text-2xl font-bold">{avgLatency.toFixed(0)} ms</p>
        </div>

        <div className="glass-panel p-5 border-l-4 border-l-red-500 rounded-l-none">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="font-bold text-sm">Recent Errors</h3>
          </div>
          <p className={`text-2xl font-bold ${errorCount > 0 ? 'text-red-500' : ''}`}>
            {errorCount}
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel overflow-hidden mt-8">
        <div className="p-4 border-b border-border bg-secondary/30">
          <h2 className="font-bold">Recent API Traffic</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Endpoint</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Latency</th>
                <th className="px-6 py-3">Error Context</th>
              </tr>
            </thead>
            <tbody>
              {logs?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No API logs recorded yet.
                  </td>
                </tr>
              )}
              {logs?.map((log) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {log.endpoint}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      log.status_code >= 400 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {log.status_code || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.latency_ms} ms
                  </td>
                  <td className="px-6 py-4 text-xs text-red-500 max-w-xs truncate" title={log.error_message}>
                    {log.error_message || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
