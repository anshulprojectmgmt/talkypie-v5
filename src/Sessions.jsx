import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, isUnauthorizedError } from "./config/api";
import { useAuth } from "./contexts/AuthContext";

export default function SessionsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [totals, setTotals] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    totalCost: 0,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchSessions() {
      try {
        const data = await apiRequest("/vapi/sessions");
        if (!isMounted) return;

        setSessions(data.callData || []);
        setTotals({
          totalSessions: Number(data.totalSessions || 0),
          totalMinutes: Number(data.totalMinutes || 0),
          totalCost: Number(data.totalCost || 0),
        });
      } catch (error) {
        if (!isMounted) return;

        if (isUnauthorizedError(error)) {
          logout();
          navigate("/login", { replace: true, state: { from: "/sessions" } });
          return;
        }

        setErrorMessage(error?.message || "Failed to fetch sessions");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSessions();
    return () => {
      isMounted = false;
    };
  }, [logout, navigate]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600">Loading your sessions...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-8 mb-20 md:mb-0">
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Call Sessions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md py-6 px-4">
            <p className="text-gray-500 text-sm">Total Sessions</p>
            <p className="text-2xl font-bold text-blue-600">{totals.totalSessions}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md py-6 px-4">
            <p className="text-gray-500 text-sm">Total Minutes</p>
            <p className="text-2xl font-bold text-blue-600">
              {totals.totalMinutes.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md py-6 px-4">
            <p className="text-gray-500 text-sm">Total Cost</p>
            <p className="text-2xl font-bold text-blue-600">
              ${totals.totalCost.toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 sm:p-6 lg:p-8">
        {sessions.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-md p-8 text-center text-gray-600">
            No call sessions found for your account yet.
          </div>
        ) : (
          sessions.map((session, index) => {
            const durationSeconds = Number(session.durationSeconds || 0);
            const cost = Number(session.cost || 0);
            const isLongCall = durationSeconds > 60;
            const isLowCost = cost < 0.05;

            return (
              <div
                key={`${session.timestamp || "session"}-${index}`}
                className="bg-white border-l-4 border-blue-500 rounded-2xl shadow-xl p-6 min-h-[280px] flex flex-col justify-between hover:shadow-2xl transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm text-gray-500 font-medium">
                    {session.timestamp
                      ? new Date(session.timestamp).toLocaleString()
                      : "Unknown time"}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {isLongCall && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded-full">
                        Long Call
                      </span>
                    )}
                    {isLowCost && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-semibold rounded-full">
                        Low Cost
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-800 text-base leading-relaxed font-medium line-clamp-5 mb-4">
                  {session.summary && session.summary.length > 0
                    ? session.summary
                    : "No detailed summary available for this call."}
                </p>

                <div className="flex items-center justify-between text-base text-gray-600 font-semibold mb-4">
                  <span>{durationSeconds.toFixed(2)} sec</span>
                  <span>${cost.toFixed(4)}</span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Recording
                  </label>
                  <audio controls className="w-full rounded-lg shadow-sm">
                    <source src={session.recordingUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
