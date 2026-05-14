'use client';

import { useEffect, useState } from 'react';

import toast, {
  Toaster,
} from 'react-hot-toast';

import {
  LayoutDashboard,
  FileText,
  Activity,
  LogOut,
  Pill,
  User,
  Shield,
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

  const [patientId, setPatientId] =
    useState('');

  const [medicine, setMedicine] =
    useState('');

  const [dosage, setDosage] =
    useState('');

  const [quantity, setQuantity] =
    useState('');

  const [instructions, setInstructions] =
    useState('');

  const [notes, setNotes] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const storedUser =
      localStorage.getItem('user');

    if (storedUser) {
      const parsedUser =
        JSON.parse(storedUser);

      setUser(parsedUser);

      loadData(parsedUser);
    }
  }, []);

  async function loadData(currentUser: any) {
    const token =
      localStorage.getItem('token');

    if (currentUser.role === 'ADMIN') {
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
  }

  async function handleLogin() {
    try {
      setLoading(true);

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

      const data =
        await response.json();

      localStorage.setItem(
        'token',
        data.access_token,
      );

      localStorage.setItem(
        'userId',
        data.user.id,
      );

      localStorage.setItem(
        'user',
        JSON.stringify(data.user),
      );

      setUser(data.user);

      await loadData(data.user);

      toast.success(
        'Login successful!',
      );
    } catch (error) {
      toast.error(
        'Login failed',
      );
    } finally {
      setLoading(false);
    }
  }

  async function createPrescription() {
    try {
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
            patientId,

            authorId:
              localStorage.getItem(
                'userId',
              ),

            items: [
              {
                name: medicine,
                dosage,
                quantity:
                  Number(quantity),
                instructions,
              },
            ],

            notes,
          }),
        },
      );

      toast.success(
        'Prescription created!',
      );

      loadData(user);

      setPatientId('');
      setMedicine('');
      setDosage('');
      setQuantity('');
      setInstructions('');
      setNotes('');
    } catch (error) {
      toast.error(
        'Error creating prescription',
      );
    }
  }

  async function consumePrescription(
    id: string,
  ) {
    try {
      const token =
        localStorage.getItem('token');

      await fetch(
        `http://localhost:3000/prescriptions/${id}/consume`,
        {
          method: 'PATCH',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(
        'Prescription consumed!',
      );

      loadData(user);
    } catch (error) {
      toast.error(
        'Error consuming prescription',
      );
    }
  }

  function handleLogout() {
    localStorage.clear();

    location.reload();
  }

  // LOGIN
  if (!user) {
    return (
      <>
        <Toaster position="top-right" />

        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
            <h1 className="text-4xl font-bold text-slate-800 text-center mb-2">
              MediCare
            </h1>

            <p className="text-slate-500 text-center mb-8">
              Prescription Management
              System
            </p>

            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 rounded-xl border border-slate-300 mb-4 outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value,
                )
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-xl border border-slate-300 mb-6 outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value,
                )
              }
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white p-4 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading
                ? 'Loading...'
                : 'Login'}
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <main className="min-h-screen bg-slate-100 flex">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col shadow-2xl">
          <h1 className="text-3xl font-bold mb-10 tracking-wide">
            MediCare
          </h1>

          <nav className="space-y-4">
            <div className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-all p-4 rounded-xl cursor-pointer">
              <LayoutDashboard />
              <span className="text-lg font-medium">
                Dashboard
              </span>
            </div>

            <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-all p-4 rounded-xl cursor-pointer">
              <FileText />
              <span className="text-lg font-medium">
                Prescriptions
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 bg-red-500 hover:bg-red-600 transition-all p-4 rounded-xl w-full mt-8"
            >
              <LogOut />
              <span className="text-lg font-medium">
                Logout
              </span>
            </button>
          </nav>

          <div className="mt-auto pt-10 text-center text-xs text-slate-400">
            Built by Maria Fernanda
          </div>
        </aside>

        {/* CONTENT */}
        <section className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-slate-800 leading-tight">
              Welcome back,
              <span className="text-blue-600">
                {' '}
                {user.name}
              </span>{' '}
              👋
            </h1>

            <p className="text-xl text-slate-500 mt-2">
              {user.role} Dashboard
            </p>
          </div>

          {/* ADMIN */}
          {user.role === 'ADMIN' &&
            metrics && (
              <div className="grid md:grid-cols-3 gap-5 mb-10">
                <div className="bg-gradient-to-r from-indigo-500 to-violet-500 p-6 rounded-2xl text-white shadow-lg hover:scale-105 transition-all">
                  <User size={36} />

                  <h2 className="text-4xl font-bold mt-3">
                    {
                      metrics.totalUsers
                    }
                  </h2>

                  <p className="text-base mt-1 opacity-90">
                    Total Users
                  </p>
                </div>

                <div className="bg-gradient-to-r from-sky-500 to-cyan-400 p-6 rounded-2xl text-white shadow-lg hover:scale-105 transition-all">
                  <Shield size={36} />

                  <h2 className="text-4xl font-bold mt-3">
                    {
                      metrics.totalDoctors
                    }
                  </h2>

                  <p className="text-base mt-1 opacity-90">
                    Doctors
                  </p>
                </div>

                <div className="bg-gradient-to-r from-emerald-500 to-green-400 p-6 rounded-2xl text-white shadow-lg hover:scale-105 transition-all">
                  <Activity size={36} />

                  <h2 className="text-4xl font-bold mt-3">
                    {
                      metrics.totalPrescriptions
                    }
                  </h2>

                  <p className="text-base mt-1 opacity-90">
                    Prescriptions
                  </p>
                </div>
              </div>
            )}

          {/* CREATE */}
          {user.role === 'DOCTOR' && (
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-10 border border-slate-200">
              <h2 className="text-3xl font-bold mb-6 text-slate-800">
                Create Prescription
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  className="border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={patientId}
                  onChange={(e) =>
                    setPatientId(
                      e.target.value,
                    )
                  }
                >
                  <option value="">
                    Select Patient
                  </option>

                  {patients.map(
                    (patient) => (
                      <option
                        key={
                          patient.id
                        }
                        value={
                          patient.id
                        }
                      >
                        {patient.name}
                      </option>
                    ),
                  )}
                </select>

                <input
                  type="text"
                  placeholder="Medicine"
                  className="border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={medicine}
                  onChange={(e) =>
                    setMedicine(
                      e.target.value,
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Dosage"
                  className="border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  className="border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  className="border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={instructions}
                  onChange={(e) =>
                    setInstructions(
                      e.target.value,
                    )
                  }
                />

                <textarea
                  placeholder="Notes"
                  className="border border-slate-300 p-3 rounded-xl md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={4}
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
                className="mt-6 bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md"
              >
                Create Prescription
              </button>
            </div>
          )}

          {/* PRESCRIPTIONS */}
          <div>
            <h2 className="text-4xl font-bold mb-6 text-slate-800">
              Prescriptions
            </h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {prescriptions.map(
                (prescription) => (
                  <div
                    key={
                      prescription.id
                    }
                    className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-slate-800">
                        {
                          prescription.code
                        }
                      </h3>

                      <span
                        className={`px-4 py-2 rounded-full text-white text-sm font-semibold shadow-sm ${
                          prescription.status ===
                          'pending'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      >
                        {
                          prescription.status
                        }
                      </span>
                    </div>

                    <div className="space-y-2 text-base text-slate-700">
                      <p>
                        <strong>
                          Patient:
                        </strong>{' '}
                        {
                          prescription
                            .patient
                            ?.name
                        }
                      </p>

                      <p>
                        <strong>
                          Doctor:
                        </strong>{' '}
                        {
                          prescription
                            .author
                            ?.name
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
                      <div className="flex items-center gap-2 mb-4">
                        <Pill className="text-blue-600" />

                        <h4 className="text-lg font-semibold text-slate-800">
                          Medicines
                        </h4>
                      </div>

                      <div className="space-y-4">
                        {prescription.medicines?.map(
                          (
                            medicine: any,
                            index: number,
                          ) => (
                            <div
                              key={index}
                              className="bg-slate-50 border border-slate-200 p-4 rounded-xl"
                            >
                              <p className="text-lg font-semibold text-slate-800">
                                {
                                  medicine.name
                                }
                              </p>

                              <p className="text-sm text-slate-600">
                                {
                                  medicine.dosage
                                }
                              </p>

                              <p className="text-sm text-slate-600">
                                Qty:{' '}
                                {
                                  medicine.quantity
                                }
                              </p>

                              <p className="text-sm text-slate-600">
                                {
                                  medicine.instructions
                                }
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {user.role ===
                      'PATIENT' &&
                      prescription.status ===
                        'pending' && (
                        <button
                          onClick={() =>
                            consumePrescription(
                              prescription.id,
                            )
                          }
                          className="mt-6 w-full bg-green-600 hover:bg-green-700 transition-all text-white p-3 rounded-xl text-lg font-semibold"
                        >
                          Mark as Consumed
                        </button>
                      )}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}