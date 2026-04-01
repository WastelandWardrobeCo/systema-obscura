export default function handler(req, res) {
  res.status(200).json({
    message: "Systema Obscura Agent Online",
    status: "operational"
  });
}
