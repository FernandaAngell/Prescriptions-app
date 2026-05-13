'use client';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

import {
  LayoutDashboard,
  FileText,
  Activity,
  LogOut,
  Pill,
} from 'lucide-react';

export default function Home() {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [user, setUser] =
    useState<any>(null);

  const [metrics, setMetrics] =
    useState<any>(null);

  const [prescriptions, setPrescriptions] =
    useState<any[]>([]);

  const [patients, setPatients] =
  useState<any[]>([]);

  // CREATE PRESCRIPTION
  const [patientId, setPatientId] =
    useState('');

  const [notes, setNotes] =
    useState('');

  const [medicineName, setMedicineName] =
    useState('');

  const [dosage, setDosage] =
    useState('');

  const [quantity, setQuantity] =
    useState('');

  const [instructions, setInstructions] =
    useState('');

  useEffect(() => {
    async function loadData() {
      const storedUser =
        localStorage.getItem('user');

      if (storedUser) {
        const parsedUser =
          JSON.parse(storedUser);

        setUser(parsedUser);

        const token =
          localStorage.getItem('token');

        // LOAD PATIENTS
const responsePatients =
  await fetch(
    'http://localhost:3000/users',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

const patientsData =
  await responsePatients.json();

const onlyPatients =
  patientsData.filter(
    (user: any) =>
      user.role === 'PATIENT',
  );

setPatients(onlyPatients);

        // ADMIN METRICS
        if (
          parsedUser.role === 'ADMIN'
        ) {
          const responseMetrics =
            await fetch(
              'http://localhost:3000/admin/metrics',
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

          const metricsData =
            await responseMetrics.json();

          setMetrics(metricsData);
        }

        // PRESCRIPTIONS
        const responsePrescriptions =
          await fetch(
            'http://localhost:3000/prescriptions',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

        const prescriptionsData =
          await responsePrescriptions.json();

        setPrescriptions(
          prescriptionsData,
        );
      }
    }

    loadData();
  }, []);

  async function handleLogin() {
    const response = await fetch(
      'http://localhost:3000/auth/login',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

    const data = await response.json();

    localStorage.setItem(
      'token',
      data.access_token,
    );

    localStorage.setItem(
      'user',
      JSON.stringify(data.user),
    );

    setUser(data.user);

    const token =
      data.access_token;

    // ADMIN METRICS
    if (
      data.user.role === 'ADMIN'
    ) {
      const responseMetrics =
        await fetch(
          'http://localhost:3000/admin/metrics',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

      const metricsData =
        await responseMetrics.json();

      setMetrics(metricsData);
    }

    // PRESCRIPTIONS
    const responsePrescriptions =
      await fetch(
        'http://localhost:3000/prescriptions',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

    const prescriptionsData =
      await responsePrescriptions.json();

    setPrescriptions(
      prescriptionsData,
    );
  }

  async function createPrescription() {
    const token =
      localStorage.getItem('token');

    await fetch(
      'http://localhost:3000/prescriptions',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          notes,
          patientId,

          authorId: user.id,

          items: [
            {
              name: medicineName,
              dosage,

              quantity:
                Number(quantity),

              instructions,
            },
          ],
        }),
      },
    );

    alert(
      'Prescription created!',
    );

    location.reload();
  }

  function handleLogout() {
    localStorage.clear();
    location.reload();
  }

  // LOGIN PAGE
if (!user) {
  return (
    <>
      <Toaster position="top-right" />

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-md">
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            MediCare
          </h1>

          <p className="text-gray-300 text-center mb-8">
            Prescription Management
            System
          </p>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 mb-4 outline-none"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 mb-6 outline-none"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white p-4 rounded-xl font-semibold"
          >
            Login
          </button>
        </div>
      </main>
    </>
  );
}

  // DASHBOARD
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white p-6 flex flex-col justify-between shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold mb-10">
            MediCare
          </h1>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all">
              <LayoutDashboard size={20} />
              Dashboard
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all">
              <FileText size={20} />
              Prescriptions
            </div>

            {user.role === 'ADMIN' && (
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all">
                <Activity size={20} />
                Metrics
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition-all duration-300 p-4 rounded-xl"
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut size={18} />
            Logout
          </div>
        </button>
      </aside>

      {/* CONTENT */}
      <section className="flex-1 p-10 overflow-auto scroll-smooth">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-900">
            Welcome back,
            <span className="text-blue-600">
              {' '}
              {user.name}
            </span>{' '}
            👋
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            {user.role} Dashboard
          </p>
        </div>

        {/* ADMIN STATS */}
        {user.role === 'ADMIN' &&
          metrics && (
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <p className="text-lg">
                  Total Users
                </p>

                <h2 className="text-5xl font-bold mt-3">
                  {metrics.totalUsers}
                </h2>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <p className="text-lg">
                  Prescriptions
                </p>

                <h2 className="text-5xl font-bold mt-3">
                  {
                    metrics.totalPrescriptions
                  }
                </h2>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <p className="text-lg">
                  Consumed
                </p>

                <h2 className="text-5xl font-bold mt-3">
                  {
                    metrics.consumedPrescriptions
                  }
                </h2>
              </div>
            </div>
          )}

        {/* DOCTOR FORM */}
        {user.role === 'DOCTOR' && (
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mb-10">
            <h2 className="text-3xl font-bold text-black mb-6">
              Create Prescription
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
             <select
    className="border p-4 rounded-xl text-black"
    value={patientId}
    onChange={(e) =>
      setPatientId(e.target.value)
    }
  >
    <option value="">
      Select Patient
    </option>

    {patients.map((patient) => (
      <option
        key={patient.id}
        value={patient.id}
      >
        {patient.name}
      </option>
    ))}
  </select>
           

              <input
                type="text"
                placeholder="Medicine"
                className="border p-4 rounded-xl text-black"
                value={medicineName}
                onChange={(e) =>
                  setMedicineName(
                    e.target.value,
                  )
                }
              />

              <input
                type="text"
                placeholder="Dosage"
                className="border p-4 rounded-xl text-black"
                value={dosage}
                onChange={(e) =>
                  setDosage(
                    e.target.value,
                  )
                }
              />

              <input
                type="number"
                placeholder="Quantity"
                className="border p-4 rounded-xl text-black"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value,
                  )
                }
              />

              <input
                type="text"
                placeholder="Instructions"
                className="border p-4 rounded-xl text-black"
                value={instructions}
                onChange={(e) =>
                  setInstructions(
                    e.target.value,
                  )
                }
              />

              <textarea
                placeholder="Notes"
                className="border p-4 rounded-xl text-black"
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value,
                  )
                }
              />
            </div>

            <button
              onClick={
                createPrescription
              }
              className="mt-6 bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-4 rounded-xl"
            >
              Create Prescription
            </button>
          </div>
        )}

        {/* PRESCRIPTIONS */}
        <div>
          <h2 className="text-4xl font-bold text-black mb-8">
            Prescriptions
          </h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {prescriptions.map(
              (prescription) => (
                <div
                  key={
                    prescription.id
                  }
                  className="bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-2xl font-bold text-black">
                      {
                        prescription.code
                      }
                    </h3>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        prescription.status ===
                        'consumed'
                          ? 'bg-green-500 text-white'
                          : 'bg-yellow-400 text-black'
                      }`}
                    >
                      {
                        prescription.status
                      }
                    </span>
                  </div>

                  <div className="space-y-2 text-black">
                    <p>
                      <strong>
                        Patient:
                      </strong>{' '}
                      {
                        prescription
                          .patient.name
                      }
                    </p>

                    <p>
                      <strong>
                        Doctor:
                      </strong>{' '}
                      {
                        prescription
                          .author.name
                      }
                    </p>

                    <p>
                      <strong>
                        Notes:
                      </strong>{' '}
                      {
                        prescription.notes
                      }
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Pill
                        size={18}
                        className="text-blue-600"
                      />

                      <h4 className="font-bold text-black">
                        Medicines
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {prescription.items.map(
                        (
                          item: any,
                        ) => (
                          <div
                            key={item.id}
                            className="bg-gray-100 p-4 rounded-2xl"
                          >
                            <p className="font-bold text-black">
                              {
                                item.name
                              }
                            </p>

                            <p className="text-gray-700">
                              {
                                item.dosage
                              }
                            </p>

                            <p className="text-gray-700">
                              Qty:{' '}
                              {
                                item.quantity
                              }
                            </p>

                            <p className="text-gray-700">
                              {
                                item.instructions
                              }
                            </p>
                          </div>
                        ),
                      )}
                    </div>

                    {/* PATIENT BUTTON */}
                    {user.role ===
                      'PATIENT' &&
                      prescription.status ===
                        'pending' && (
                        <button
                          onClick={async () => {
                            const token =
                              localStorage.getItem(
                                'token',
                              );

                            await fetch(
                              `http://localhost:3000/prescriptions/${prescription.id}/consume`,
                              {
                                method:
                                  'PATCH',

                                headers:
                                  {
                                    Authorization: `Bearer ${token}`,
                                  },
                              },
                            );

                            alert(
                              'Prescription consumed!',
                            );

                            location.reload();
                          }}
                          className="mt-5 bg-green-600 hover:bg-green-700 transition-all duration-300 text-white px-5 py-3 rounded-xl"
                        >
                          Mark as
                          Consumed
                        </button>
                      )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}