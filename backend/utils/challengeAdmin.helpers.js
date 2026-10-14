import mongoose from "mongoose";

import { deleteImage } from "../services/cloudinary.service.js";

/* =========================
   CONSTANTS
========================= */

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];
export const STATUSES = ["draft", "published", "archived"];

/* =========================
   ERRORS
========================= */

// Erreur "attendue" : son message est renvoyé tel quel au client.
export class AdminInputError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.name = "AdminInputError";
        this.status = status;
    }
}

// À appeler dans le catch de chaque controller.
export const handleAdminError = (err, res, next) => {
    if (err instanceof AdminInputError) {
        return res
            .status(err.status)
            .json({ success: false, message: err.message });
    }

    // Erreurs de validation du schéma Mongoose
    if (err?.name === "ValidationError" && err.errors) {
        const message = Object.values(err.errors)
            .map((error) => error.message)
            .join(" ");

        return res.status(400).json({ success: false, message });
    }

    // Slug déjà pris (index unique) : deux créations simultanées
    if (err?.code === 11000) {
        return res.status(409).json({
            success: false,
            message:
                "A challenge with the same slug already exists. Please try again.",
        });
    }

    return next(err);
};

/* =========================
   VALIDATION HELPERS
========================= */

export const assertValidId = (id, label = "ID") => {
    if (!mongoose.isValidObjectId(id)) {
        throw new AdminInputError(`Invalid ${label}`);
    }
};

export const requireString = (value, label, { min = 1, max } = {}) => {
    if (typeof value !== "string" || value.trim().length < min) {
        throw new AdminInputError(
            min > 1
                ? `${label} must contain at least ${min} characters`
                : `${label} is required`
        );
    }

    const trimmed = value.trim();

    if (max && trimmed.length > max) {
        throw new AdminInputError(
            `${label} must not exceed ${max} characters`
        );
    }

    return trimmed;
};

// Chaîne facultative : undefined / null => "" (permet aussi de vider un champ).
export const optionalString = (value, label, { max } = {}) => {
    if (value === undefined || value === null) return "";

    if (typeof value !== "string") {
        throw new AdminInputError(`${label} must be a string`);
    }

    const trimmed = value.trim();

    if (max && trimmed.length > max) {
        throw new AdminInputError(
            `${label} must not exceed ${max} characters`
        );
    }

    return trimmed;
};

export const parseEnum = (value, allowed, label, fallback) => {
    if (value === undefined && fallback !== undefined) return fallback;

    if (!allowed.includes(value)) {
        throw new AdminInputError(
            `${label} must be one of: ${allowed.join(", ")}`
        );
    }

    return value;
};

export const parseNumber = (
    value,
    label,
    { min, max, integer = false } = {}
) => {
    const number =
        typeof value === "number"
            ? value
            : typeof value === "string" && value.trim() !== ""
              ? Number(value)
              : NaN;

    if (!Number.isFinite(number)) {
        throw new AdminInputError(`${label} must be a number`);
    }

    if (integer && !Number.isInteger(number)) {
        throw new AdminInputError(`${label} must be an integer`);
    }

    if (min !== undefined && number < min) {
        throw new AdminInputError(`${label} must be at least ${min}`);
    }

    if (max !== undefined && number > max) {
        throw new AdminInputError(`${label} must be at most ${max}`);
    }

    return number;
};

// Avec une requête multipart, les objets / tableaux arrivent en JSON string.
export const parseJson = (value, label) => {
    if (typeof value !== "string") return value;

    try {
        return JSON.parse(value);
    } catch {
        throw new AdminInputError(`Invalid ${label} format`);
    }
};

export const parseArray = (value, label) => {
    if (value === undefined || value === null || value === "") return [];

    const parsed = parseJson(value, label);

    if (!Array.isArray(parsed)) {
        throw new AdminInputError(`${label} must be an array`);
    }

    return parsed;
};

export const parseStringArray = (value, label, { max } = {}) => {
    const items = parseArray(value, label);

    if (!items.every((item) => typeof item === "string")) {
        throw new AdminInputError(`${label} must only contain strings`);
    }

    const cleaned = items.map((item) => item.trim()).filter(Boolean);

    if (max && cleaned.some((item) => item.length > max)) {
        throw new AdminInputError(
            `Each item of ${label} must not exceed ${max} characters`
        );
    }

    return [...new Set(cleaned)];
};

/* =========================
   SLUG
========================= */

export const slugify = (text) => {
    const slug = text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80)
        .replace(/-+$/g, "");

    return slug || "challenge";
};

// Génère un slug depuis le titre et ajoute -2, -3... s'il existe déjà.
export const generateUniqueSlug = async (Model, text) => {
    const base = slugify(text);

    let slug = base;
    let suffix = 2;

    while (await Model.exists({ slug })) {
        slug = `${base}-${suffix}`;
        suffix += 1;
    }

    return slug;
};

/* =========================
   CLOUDINARY
========================= */

// Ne lève jamais d'erreur : un échec de nettoyage ne doit pas casser la réponse.
export const safeDeleteImage = async (publicId) => {
    if (!publicId) return;

    try {
        await deleteImage(publicId);
    } catch (error) {
        console.error("Error deleting Cloudinary image:", publicId, error);
    }
};

export const safeDeleteImages = async (publicIds = []) => {
    await Promise.all(publicIds.map((publicId) => safeDeleteImage(publicId)));
};