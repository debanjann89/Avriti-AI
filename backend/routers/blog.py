from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter()

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    read_time: str
    date: str
    author: str
    image: str
    interactive_text: str | None = None
    interactive_link: str | None = None

class BlogPostUpdate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    read_time: str
    date: str
    author: str
    image: str
    interactive_text: str | None = None
    interactive_link: str | None = None

class BlogSettingsUpdate(BaseModel):
    blog_enabled: bool

INITIAL_ARTICLES = [
  {
    "title": "The Loom and the Neural Net: Simulating Silk Weave Tension",
    "excerpt": "Discover how Aavriti's physics-guided neural solvers calculate fabric weights, thread borders, and light compositing for high-realism catalogs.",
    "category": "AI Studio",
    "read_time": "5 min read",
    "date": "June 04, 2026",
    "author": "Dr. Sanjay Nair, Principal AI Architect",
    "image": "https://images.unsplash.com/photo-1558271821-3ad046a38cf0?auto=format&fit=crop&w=800&q=80",
    "content": "At the intersection of centuries-old handloom weaving and modern computer vision lies a complex challenge: how do you model the weight, sheen, and fluid drape of a raw Kanjeevaram silk saree using neural networks?\n\nTraditional cloth simulation models fabric as a network of spring particles. While effective for simple cottons, this approach fails to capture the multi-directional tension, brocade stiffness, and metallic zari reflections of luxury Indian textiles.\n\nAavriti AI solves this by integrating physics priors directly into generative diffusion pipelines (our Physics-Guided Neural Solver). The network is trained on texture maps of actual handlooms, enabling it to:\n1. Detect fabric thickness: Differentiating between lightweight georgettes and dense 3-ply silk threads.\n2. Calculate gravity vectors: Simulating realistic folds around shoulder slopes and pleats.\n3. Compose light refraction: Mirroring the subtle color shift (dhoop-chhaon) when zari metal threads catch ambient studio lights.\n\nThe result is a B2B catalog showcase that feels indistinguishable from real photos, saving boutique owners thousands in logistics.",
    "interactive_text": "Try draping garments now in the AI Try-On Studio",
    "interactive_link": "/tryon"
  },
  {
    "title": "Banarasi Zari: Legacy Craft in a Digital Era",
    "excerpt": "Stepping inside Varanasi's narrow lanes to explore the ancient craft of brocade weaving and how digital showcases expand global markets.",
    "category": "Heritage Artisans",
    "read_time": "6 min read",
    "date": "May 28, 2026",
    "author": "Priya Das, Craft & Textile Historian",
    "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    "content": "For generations, the weaver communities of Varanasi have mapped elaborate geometric and floral motifs onto silk threads using jacquard cards. A single Banarasi saree can take anywhere from fifteen days to six months to weave, combining mulberry silk with gold and silver thread overlays (zari).\n\nHowever, traditional weavers face severe challenges in the modern supply chain. Large distributors squeeze margins, and presenting catalogs to global buyers requires costly physical logistics.\n\nAavriti AI's mission is to empower these traditional boutique owners. By providing high-realism, cloud-accessible virtual modeling tools, we allow a weaver in Varanasi to list their newest creation instantly for fashion-forward buyers in Paris, New York, or Mumbai. The digital twin captures the intricate metallic sheen of real zari, preserving the premium heritage appeal of the weave while removing the barrier of physical entry.",
    "interactive_text": "Browse the traditional Sarees catalog collection",
    "interactive_link": "/collections"
  },
  {
    "title": "The Sizing Blueprint: Adjusting AI Models for Perfect Drape",
    "excerpt": "A practical guide to configuring your height, weight, and silhouette size within Aavriti's styling profile to generate precise fittings.",
    "category": "Styling Guides",
    "read_time": "4 min read",
    "date": "May 19, 2026",
    "author": "Amit Sen, Fashion Coordinator",
    "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    "content": "Generative try-on is only as good as its fitting accuracy. If the AI model doesn't understand the wearer's physical dimensions, the drapery looks unnatural—fabric folds bunch up, or borders distort.\n\nTo get the most photorealistic fitting from our Stable Diffusion and Flux neural pipelines, Aavriti's profiling system supports dynamic sizing controls:\n1. Select Standardized Sizing (XS to XXL): This maps directly to pre-trained model skeletal postures, adjusting shoulder-to-shoulder width and torso heights.\n2. Input Height & Weight: Our styling prompt builder uses height (in cm) and weight (in kg) parameters to calculate volume density prompts. For instance, selecting an 'L' fit and inputting 175cm generates prompts mentioning \"athletic and well-built frame\" to adjust fabric outlines.\n3. Select Angles & Backdrop: Generative fabric solvers calculate shadows. A front-facing portrait requires direct studio light prompts, while outdoor palace courtyards introduce warm side-lit ambient bounces.\n\nBy tuning these dimensions in your Profile, you guide the AI model to render drape folds that conform precisely to your shape.",
    "interactive_text": "Update your Profile Sizing measurements",
    "interactive_link": "/profile"
  },
  {
    "title": "Aavriti Digital Runway 2026: Virtual Fashion Showcases",
    "excerpt": "Entering the digital metaverse with virtual runway showcases, custom avatars, and our upcoming 3D garment customization solver.",
    "category": "Digital Runway",
    "read_time": "7 min read",
    "date": "May 12, 2026",
    "author": "Rohan Kapoor, Creative Director",
    "image": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    "content": "Physical fashion runways are highly exclusive, resource-heavy events. They produce tons of waste and are accessible only to a select few. Aavriti is pioneering the digital fashion future by designing virtual runway shows.\n\nUsing our upcoming 3D garment customization solver, designers will be able to upload flat sketches, map raw textures using generative prompts, and see simulated fabrics drape over walking, dynamic digital model avatars.\n\nThis runway features:\n- Interactive drape sliders: Let viewers adjust lighting warmth and wind velocity in real-time.\n- Instant buyer pre-order checkouts: Seamlessly purchase items straight from the runway.\n- Bespoke sizing mapping: The virtual models dynamically reshape to the viewer's saved body metrics, allowing everyone to see how the runway collections would look on their own physique.\n\nThe next generation of fashion isn't sewn; it's simulated.",
    "interactive_text": "Explore our latest boutique Collections",
    "interactive_link": "/collections"
  }
]

def seed_posts_if_empty(db: Session):
    count = db.query(models.BlogPost).count()
    if count == 0:
        for art in INITIAL_ARTICLES:
            db_post = models.BlogPost(
                title=art["title"],
                excerpt=art["excerpt"],
                content=art["content"],
                category=art["category"],
                read_time=art["read_time"],
                date=art["date"],
                author=art["author"],
                image=art["image"],
                interactive_text=art["interactive_text"],
                interactive_link=art["interactive_link"]
            )
            db.add(db_post)
        db.commit()

@router.get("/posts")
def get_posts(db: Session = Depends(get_db)):
    seed_posts_if_empty(db)
    return db.query(models.BlogPost).order_by(models.BlogPost.id.desc()).all()

@router.post("/post")
def create_post(payload: BlogPostCreate, db: Session = Depends(get_db)):
    new_post = models.BlogPost(
        title=payload.title,
        excerpt=payload.excerpt,
        content=payload.content,
        category=payload.category,
        read_time=payload.read_time,
        date=payload.date,
        author=payload.author,
        image=payload.image,
        interactive_text=payload.interactive_text,
        interactive_link=payload.interactive_link
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.put("/post/{post_id}")
def update_post(post_id: int, payload: BlogPostUpdate, db: Session = Depends(get_db)):
    post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found.")

    post.title = payload.title
    post.excerpt = payload.excerpt
    post.content = payload.content
    post.category = payload.category
    post.read_time = payload.read_time
    post.date = payload.date
    post.author = payload.author
    post.image = payload.image
    post.interactive_text = payload.interactive_text
    post.interactive_link = payload.interactive_link

    db.commit()
    db.refresh(post)
    return post

@router.delete("/post/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found.")

    db.delete(post)
    db.commit()
    return {"message": "Blog post deleted successfully"}

@router.get("/settings")
def get_blog_settings(db: Session = Depends(get_db)):
    setting = db.query(models.SystemSetting).filter(models.SystemSetting.key == "blog_enabled").first()
    if not setting:
        # Default value is True
        return {"blog_enabled": True}
    return {"blog_enabled": setting.value.lower() == "true"}

@router.post("/settings")
def update_blog_settings(payload: BlogSettingsUpdate, db: Session = Depends(get_db)):
    setting = db.query(models.SystemSetting).filter(models.SystemSetting.key == "blog_enabled").first()
    if not setting:
        setting = models.SystemSetting(key="blog_enabled", value=str(payload.blog_enabled).lower())
        db.add(setting)
    else:
        setting.value = str(payload.blog_enabled).lower()

    db.commit()
    return {"blog_enabled": setting.value.lower() == "true"}
