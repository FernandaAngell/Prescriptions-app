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

    // ADMIN METRICS
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

    // PATIENTS
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

            
  items: [
    {
      medicine,
      dosage,
      quantity: Number(quantity),
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
                setEmail(
                  e.target.value,
                )
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 mb-6 outline-none"
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
        <aside className="w-80 bg-slate-950 text-white p-8 flex flex-col">
          <h1 className="text-5xl font-bold mb-12">
            MediCare
          </h1>

          <nav className="space-y-4">
            <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl">
              <LayoutDashboard />
              <span className="text-2xl">
                Dashboard
              </span>
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl">
              <FileText />
              <span className="text-2xl">
                Prescriptions
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-4 bg-red-600 hover:bg-red-700 transition-all p-5 rounded-2xl w-full mt-10"
            >
              <LogOut />
              <span className="text-2xl">
                Logout
              </span>
            </button>
          </nav>

          <div className="mt-auto pt-10 text-center text-sm text-blue-300 font-medium">
            Built by Maria Fernanda Tolosa Angel
          </div>
        </aside>

        {/* CONTENT */}
        <section className="flex-1 p-12">
          <div className="mb-12">
            <h1 className="text-7xl font-bold text-slate-900">
              Welcome back,
              <span className="text-blue-600">
                {' '}
                {user.name}
              </span>{' '}
              👋
            </h1>

            <p className="text-3xl text-slate-600 mt-4">
              {user.role} Dashboard
            </p>
          </div>

          {/* ADMIN */}
          {user.role === 'ADMIN' &&
            metrics && (
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 rounded-3xl text-white shadow-xl">
                  <User size={40} />
                  <h2 className="text-5xl font-bold mt-4">
                    {
                      metrics.totalUsers
                    }
                  </h2>
                  <p className="text-xl mt-2">
                    Total Users
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 rounded-3xl text-white shadow-xl">
                  <Shield size={40} />
                  <h2 className="text-5xl font-bold mt-4">
                    {
                      metrics.totalDoctors
                    }
                  </h2>
                  <p className="text-xl mt-2">
                    Doctors
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-8 rounded-3xl text-white shadow-xl">
                  <Activity size={40} />
                  <h2 className="text-5xl font-bold mt-4">
                    {
                      metrics.totalPrescriptions
                    }
                  </h2>
                  <p className="text-xl mt-2">
                    Prescriptions
                  </p>
                </div>
              </div>
            )}

          {/* CREATE */}
          {user.role === 'DOCTOR' && (
            <div className="bg-white p-10 rounded-3xl shadow-xl mb-12">
              <h2 className="text-5xl font-bold mb-8">
                Create Prescription
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  className="border p-4 rounded-xl text-black"
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
                  className="border p-4 rounded-xl"
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
                  className="border p-4 rounded-xl"
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
                  className="border p-4 rounded-xl"
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
                  className="border p-4 rounded-xl"
                  value={instructions}
                  onChange={(e) =>
                    setInstructions(
                      e.target.value,
                    )
                  }
                />

                <textarea
                  placeholder="Notes"
                  className="border p-4 rounded-xl md:col-span-2"
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
                className="mt-6 bg-blue-600 hover:bg-blue-700 transition-all text-white px-8 py-4 rounded-2xl text-xl font-semibold"
              >
                Create Prescription
              </button>
            </div>
          )}

          {/* PRESCRIPTIONS */}
          <div>
            <h2 className="text-6xl font-bold mb-8">
              Prescriptions
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {prescriptions.map(
                (prescription) => (
                  <div
                    key={
                      prescription.id
                    }
                    className="bg-white rounded-3xl shadow-xl p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-4xl font-bold">
                        {
                          prescription.code
                        }
                      </h3>

                      <span
                        className={`px-6 py-3 rounded-full text-white text-lg font-semibold ${
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

                    <div className="space-y-3 text-xl">
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

                    <div className="mt-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Pill className="text-blue-600" />
                        <h4 className="text-2xl font-bold">
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
                              className="bg-slate-100 p-6 rounded-2xl"
                            >
                              <p className="text-2xl font-bold">
                                {
                                  medicine.name
                                }
                              </p>

                              <p className="text-lg text-slate-600">
                                {
                                  medicine.dosage
                                }
                              </p>

                              <p className="text-lg text-slate-600">
                                Qty:{' '}
                                {
                                  medicine.quantity
                                }
                              </p>

                              <p className="text-lg text-slate-600">
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
                          className="mt-8 w-full bg-green-600 hover:bg-green-700 transition-all text-white p-4 rounded-2xl text-xl font-semibold"
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