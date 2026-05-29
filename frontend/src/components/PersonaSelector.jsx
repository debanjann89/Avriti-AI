const PERSONA_OPTIONS = {
  gender: ["Woman", "Man"],
  ageGroup: ["Teen", "Young Adult", "Adult", "Senior"],
  ethnicity: [
    "South Asian", "East Asian", "African",
    "Caucasian", "Hispanic", "Middle Eastern",
  ],
  bodyType: ["Slim", "Athletic", "Average", "Plus Size"],
};

const LABELS = {
  gender: "Gender",
  ageGroup: "Age Group",
  ethnicity: "Ethnicity",
  bodyType: "Body Type",
};

function ChipGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border
              ${value === opt
                ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-pink-400 hover:text-pink-600"
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PersonaSelector({ persona, onChange, hideGender }) {
  const update = (key) => (val) => onChange({ ...persona, [key]: val });

  return (
    <div className="flex flex-col gap-5">
      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Model Persona
      </label>

      <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-4 border border-gray-100">
        {Object.entries(PERSONA_OPTIONS)
          .filter(([key]) => !(key === "gender" && hideGender))
          .map(([key, options]) => (
            <ChipGroup
              key={key}
              label={LABELS[key]}
              options={options}
              value={persona[key]}
              onChange={update(key)}
            />
          ))}
      </div>
    </div>
  );
}
