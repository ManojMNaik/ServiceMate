import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function BookService() {
  const { technicianId } = useParams();
  const navigate = useNavigate();
  const [tech, setTech] = useState(null);
  const [form, setForm] = useState({
    bookingDate: "",
    address: "",
    state: "",
    city: "",
    issueDescription: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/technicians/${technicianId}`)
      .then((res) => {
        const data = res.data.data;
        setTech(data);
        // Pre-fill state/city from technician's location
        setForm((f) => ({
          ...f,
          state: data.state || "",
          city: data.city || "",
        }));
      })
      .catch(() => toast.error("Technician not found"));
  }, [technicianId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/bookings", {
        technicianProfileId: technicianId,
        serviceCategoryId: tech.serviceCategoryId._id,
        bookingDate: new Date(form.bookingDate).toISOString(),
        address: form.address,
        state: form.state || undefined,
        city: form.city || undefined,
        issueDescription: form.issueDescription,
      });
      toast.success("Booking created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-app py-8">
        <Card className="mx-auto max-w-lg">
          <h1 className="text-xl font-bold">Book Service</h1>
          {tech && (
            <p className="mt-1 text-sm text-gray-500">
              Technician: <strong>{tech.userId?.name}</strong> — {tech.serviceCategoryId?.name}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Preferred Date & Time"
              name="bookingDate"
              type="datetime-local"
              value={form.bookingDate}
              onChange={handleChange}
              required
            />
            <Input
              label="Service Address"
              name="address"
              placeholder="Flat 10, Anna Nagar, Chennai"
              value={form.address}
              onChange={handleChange}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="State" name="state" placeholder="Tamil Nadu" value={form.state} onChange={handleChange} />
              <Input label="City" name="city" placeholder="Chennai" value={form.city} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Describe the issue</label>
              <textarea
                name="issueDescription"
                value={form.issueDescription}
                onChange={handleChange}
                required
                rows={3}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Describe your problem..."
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Confirm Booking
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
