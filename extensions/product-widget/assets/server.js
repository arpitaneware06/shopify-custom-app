app.post("/apps/reviews/submit", async (req, res) => {
    const { pid, text, rating } = req.body;
  
    await db.collection("reviews").insertOne({
      productId: pid,
      text,
      rating: parseInt(rating),
      createdAt: new Date()
    });
  
    res.json({ success: true });
  });
  
  app.get("/apps/reviews/list", async (req, res) => {
    const pid = req.query.pid;
  
    const reviews = await db.collection("reviews")
      .find({ productId: pid })
      .sort({ createdAt: -1 })
      .toArray();
  
    res.json(reviews);
  });
  