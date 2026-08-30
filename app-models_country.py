from app.extensions import db


class Country(db.Model):
    __tablename__ = "countries"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False,
        unique=True
    )

    code = db.Column(
        db.String(10),
        nullable=False,
        unique=True
    )

    phone_code = db.Column(
        db.String(20)
    )

    currency = db.Column(
        db.String(50)
    )

    language = db.Column(
        db.String(100)
    )

    description = db.Column(
        db.Text
    )

    flag = db.Column(
        db.String(255)
    )

    is_active = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )


    # المدن التابعة للدولة
    cities = db.relationship(
        "City",
        back_populates="country",
        cascade="all, delete-orphan",
        lazy=True
    )


    def __repr__(self):
        return f"<Country {self.name}>"


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "phone_code": self.phone_code,
            "currency": self.currency,
            "language": self.language,
            "description": self.description,
            "flag": self.flag,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
