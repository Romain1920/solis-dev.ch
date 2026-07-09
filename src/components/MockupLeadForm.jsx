import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const REWARD_OPTIONS = [
  {
    label: "Nom de domaine offert",
    wheelLabel: "Domaine",
    weight: 80,
    tone: "blue",
  },
  {
    label: "1 heure de formation offerte",
    wheelLabel: "Formation",
    weight: 20,
    tone: "orange",
  },
];

const REWARD_WHEEL_OPTIONS = [
  {
    id: "domain",
    label: "Nom de domaine offert",
    wheelLabel: "Domaine",
    tone: "blue",
  },
  {
    id: "empty-1",
    label: "Pas de chance",
    wheelLabel: "Rien",
    tone: "neutral",
  },
  {
    id: "training",
    label: "1 heure de formation offerte",
    wheelLabel: "Formation",
    tone: "orange",
  },
  {
    id: "empty-2",
    label: "Pas de chance",
    wheelLabel: "Rien",
    tone: "neutral",
  },
  {
    id: "hosting",
    label: "1 mois d’hébergement offert",
    wheelLabel: "Héberg.",
    tone: "soft",
  },
  {
    id: "empty-3",
    label: "Pas de chance",
    wheelLabel: "Rien",
    tone: "neutral",
  },
  {
    id: "surprise",
    label: "Surprise",
    wheelLabel: "Surprise",
    tone: "warm",
  },
  {
    id: "empty-4",
    label: "Pas de chance",
    wheelLabel: "Rien",
    tone: "neutral",
  },
];

const REWARD_WHEEL_TURNS = 5;
const REWARD_SPIN_DURATION = 2.9;
const REWARD_SEGMENT_ANGLE = 360 / REWARD_WHEEL_OPTIONS.length;
const REWARD_WHEEL_CENTER = 50;
const REWARD_WHEEL_RADIUS = 48;
const REWARD_WHEEL_LABEL_RADIUS = 30.5;
const CHOICE_AUTO_ADVANCE_DELAY_MS = 140;

const REWARD_PARTICLES = [
  { x: -64, y: -34, delay: "0ms", size: 8, tone: "blue" },
  { x: -48, y: -60, delay: "70ms", size: 6, tone: "cyan" },
  { x: -24, y: -48, delay: "110ms", size: 7, tone: "orange" },
  { x: 4, y: -70, delay: "30ms", size: 8, tone: "peach" },
  { x: 30, y: -52, delay: "90ms", size: 6, tone: "blue" },
  { x: 58, y: -28, delay: "140ms", size: 7, tone: "cyan" },
  { x: -72, y: 2, delay: "120ms", size: 6, tone: "peach" },
  { x: -48, y: 34, delay: "40ms", size: 7, tone: "orange" },
  { x: -18, y: 54, delay: "150ms", size: 6, tone: "blue" },
  { x: 18, y: 48, delay: "80ms", size: 7, tone: "peach" },
  { x: 50, y: 26, delay: "20ms", size: 6, tone: "orange" },
  { x: 72, y: 0, delay: "130ms", size: 8, tone: "cyan" },
  { x: -56, y: 62, delay: "170ms", size: 5, tone: "cyan" },
  { x: 60, y: 58, delay: "155ms", size: 5, tone: "blue" },
  { x: -74, y: -58, delay: "190ms", size: 5, tone: "orange" },
  { x: 76, y: -50, delay: "185ms", size: 5, tone: "peach" },
  { x: -88, y: -14, delay: "210ms", size: 5, tone: "blue" },
  { x: -34, y: 82, delay: "225ms", size: 5, tone: "peach" },
  { x: 38, y: 82, delay: "205ms", size: 5, tone: "orange" },
  { x: 88, y: 18, delay: "215ms", size: 5, tone: "cyan" },
  { x: -96, y: 36, delay: "235ms", size: 4, tone: "cyan" },
  { x: -82, y: 74, delay: "255ms", size: 4, tone: "blue" },
  { x: -4, y: 96, delay: "245ms", size: 5, tone: "peach" },
  { x: 78, y: 78, delay: "250ms", size: 4, tone: "orange" },
  { x: 98, y: -18, delay: "240ms", size: 4, tone: "blue" },
  { x: 48, y: -88, delay: "230ms", size: 4, tone: "peach" },
];

const PROJECT_TYPE_OPTIONS = [
  { id: "website", label: "Site internet" },
  { id: "mobile", label: "Application mobile" },
];

const WEBSITE_TYPE_OPTIONS = ["Site vitrine", "E-commerce"];
const APP_PLATFORM_OPTIONS = ["iOS", "Android", "iOS + Android"];
const BUDGET_OPTIONS = [
  "5’000 à 10’000 CHF",
  "10’000 à 15’000 CHF",
  "Plus de 15’000 CHF",
];
const WEBSITE_TIMELINE_OPTIONS = [
  "Urgent — moins d’un mois",
  "1 à 3 mois",
  "3 à 6 mois",
  "Pas de contrainte",
];
const MOBILE_TIMELINE_OPTIONS = [
  "1 à 3 mois",
  "3 à 6 mois",
  "6 à 12 mois",
  "Pas de contrainte",
];

const FULL_COPY = {
  intro:
    "Afin de vous aider à vous projeter et à vous positionner, nous vous fournissons une première maquette de votre projet, sur mesure, sans engagement et accompagnée d'un devis gratuit.",
  reward:
    "Et parce qu'on aime bien les petits plus, tentez de gagner un bonus pour votre projet 🙂 !",
  email: "Pour qu'on puisse vous contacter et préparer votre maquette offerte.",
  final:
    "Nous vous recontacterons dans les 24 heures pour échanger sur votre projet et préparer votre maquette offerte.",
};

const COMPACT_COPY = {
  intro:
    "Un premier aperçu sur mesure, sans engagement, accompagné d’un devis gratuit.",
  reward: "Tentez de gagner un bonus pour votre projet 🙂",
  email: "Pour préparer votre maquette et vous recontacter.",
  final:
    "Nous vous recontacterons dans les 24 heures pour préparer votre maquette offerte.",
};

const INSTANT_TRANSITION = { duration: 0 };

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const pickWeightedReward = () => {
  const totalWeight = REWARD_OPTIONS.reduce(
    (total, rewardOption) => total + rewardOption.weight,
    0
  );
  let cursor = Math.random() * totalWeight;

  return (
    REWARD_OPTIONS.find((rewardOption) => {
      cursor -= rewardOption.weight;
      return cursor <= 0;
    })?.label ?? REWARD_OPTIONS[0].label
  );
};

const getRewardIndexByLabel = (label) =>
  Math.max(
    REWARD_WHEEL_OPTIONS.findIndex(
      (wheelOption) =>
        wheelOption.wheelLabel ===
        (REWARD_OPTIONS.find((rewardOption) => rewardOption.label === label)
          ?.wheelLabel ?? REWARD_WHEEL_OPTIONS[0].wheelLabel)
    ),
    0
  );

const getRewardSegmentCenterAngle = (index) =>
  index * REWARD_SEGMENT_ANGLE + REWARD_SEGMENT_ANGLE / 2;

const getRewardTargetRotation = (label) => {
  const segmentCenterAngle = getRewardSegmentCenterAngle(
    getRewardIndexByLabel(label)
  );

  return REWARD_WHEEL_TURNS * 360 + (360 - segmentCenterAngle);
};

const getRewardWheelPoint = (angle, radius = REWARD_WHEEL_RADIUS) => {
  const angleInRadians = ((angle - 90) * Math.PI) / 180;

  return {
    x: REWARD_WHEEL_CENTER + radius * Math.cos(angleInRadians),
    y: REWARD_WHEEL_CENTER + radius * Math.sin(angleInRadians),
  };
};

const getRewardWheelSegmentPath = (index) => {
  const startAngle = index * REWARD_SEGMENT_ANGLE;
  const endAngle = startAngle + REWARD_SEGMENT_ANGLE;
  const start = getRewardWheelPoint(startAngle);
  const end = getRewardWheelPoint(endAngle);
  const largeArcFlag = REWARD_SEGMENT_ANGLE > 180 ? 1 : 0;

  return [
    `M ${REWARD_WHEEL_CENTER} ${REWARD_WHEEL_CENTER}`,
    `L ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
    `A ${REWARD_WHEEL_RADIUS} ${REWARD_WHEEL_RADIUS} 0 ${largeArcFlag} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
    "Z",
  ].join(" ");
};

const getRewardWheelLabelPoint = (index) =>
  getRewardWheelPoint(
    getRewardSegmentCenterAngle(index),
    REWARD_WHEEL_LABEL_RADIUS
  );

const getRewardWheelLabelRotation = (index) => {
  const radialRotation = getRewardSegmentCenterAngle(index) - 90;
  const normalizedRotation = ((radialRotation + 180) % 360) - 180;

  if (normalizedRotation > 90) {
    return normalizedRotation - 180;
  }

  if (normalizedRotation < -90) {
    return normalizedRotation + 180;
  }

  return normalizedRotation;
};

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function LeadRewardCelebration({ isVisible }) {
  return (
    <div
      className={`lead-reward-celebration${isVisible ? " is-visible" : ""}`}
      aria-hidden="true"
    >
      {REWARD_PARTICLES.map((particle, index) => (
        <span
          className={`lead-reward-particle lead-reward-particle--${particle.tone}`}
          key={`${particle.tone}-${index}`}
          style={{
            "--particle-x": `${particle.x}px`,
            "--particle-y": `${particle.y}px`,
            "--particle-delay": particle.delay,
            "--particle-size": `${particle.size}px`,
          }}
        />
      ))}
    </div>
  );
}

function LeadRewardWheel({ wheelRef, isSpinning, showCelebration }) {
  return (
    <div className="lead-roulette" aria-hidden="true">
      <div className="lead-roulette-pointer" />
      <div className="lead-roulette-wheel" ref={wheelRef}>
        <svg viewBox="0 0 100 100" role="presentation" focusable="false">
          {REWARD_WHEEL_OPTIONS.map((option, index) => {
            const labelPoint = getRewardWheelLabelPoint(index);
            const labelRotation = getRewardWheelLabelRotation(index);

            return (
              <g
                className={`lead-roulette-segment lead-roulette-segment--${option.tone}`}
                key={option.id}
              >
                <path d={getRewardWheelSegmentPath(index)} />
                <g
                  className="lead-roulette-label"
                  transform={`translate(${labelPoint.x.toFixed(3)} ${labelPoint.y.toFixed(3)}) rotate(${labelRotation.toFixed(3)})`}
                >
                  <text textAnchor="middle" dominantBaseline="middle">
                    {option.wheelLabel}
                  </text>
                </g>
              </g>
            );
          })}
          <circle className="lead-roulette-rim" cx="50" cy="50" r="48" />
          <circle className="lead-roulette-center" cx="50" cy="50" r="8.8" />
          <circle className="lead-roulette-pin" cx="50" cy="50" r="3.7" />
        </svg>
      </div>
      <div
        className={`lead-roulette-glow${isSpinning ? " is-active" : ""}`}
      />
      <LeadRewardCelebration isVisible={showCelebration} />
    </div>
  );
}

function LeadChoiceStep({
  title,
  options,
  value,
  onSelect,
  onBack,
  onAdvance,
  nextStep,
  optionLayout = "balanced",
  autoAdvanceDelay = CHOICE_AUTO_ADVANCE_DELAY_MS,
}) {
  const advanceTimeoutRef = useRef(null);
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { id: option, label: option } : option
  );

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const handleOptionSelect = (selectedValue) => {
    if (advanceTimeoutRef.current) {
      window.clearTimeout(advanceTimeoutRef.current);
    }

    onSelect(selectedValue);

    const resolvedNextStep =
      typeof nextStep === "function" ? nextStep(selectedValue) : nextStep;

    if (!resolvedNextStep) {
      return;
    }

    advanceTimeoutRef.current = window.setTimeout(() => {
      advanceTimeoutRef.current = null;
      onAdvance(resolvedNextStep);
    }, autoAdvanceDelay);
  };

  return (
    <div className="lead-step">
      <div className="lead-step-heading">
        <h3>{title}</h3>
      </div>

      <div className={`lead-option-grid lead-option-grid--${optionLayout}`}>
        {normalizedOptions.map((option) => (
          <button
            className={`lead-option${value === option.label ? " is-selected" : ""}`}
            key={option.id}
            type="button"
            onClick={() => handleOptionSelect(option.label)}
            aria-pressed={value === option.label}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="lead-actions lead-actions--choice">
        <button
          className="lead-secondary-button"
          type="button"
          onClick={onBack}
        >
          Retour
        </button>
      </div>
    </div>
  );
}

export function MockupLeadForm({
  variant = "inline",
  className = "",
  onSubmit,
}) {
  const reducedMotion = usePrefersReducedMotion();
  const formRef = useRef(null);
  const rewardWheelRef = useRef(null);
  const rewardSpinTweenRef = useRef(null);
  const [step, setStep] = useState("reward");
  const [leadData, setLeadData] = useState({
    email: "",
    projectType: "",
    websiteType: "",
    appPlatform: "",
    budget: "",
    timeline: "",
  });
  const [reward, setReward] = useState("");
  const [pendingReward, setPendingReward] = useState("");
  const [hasSpun, setHasSpun] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [, setSubmittedPayload] = useState(null);
  const { contextSafe } = useGSAP({ scope: formRef });

  const normalizedVariant = ["studio", "inline", "legacy"].includes(variant)
    ? variant
    : "inline";
  const cardVariant = normalizedVariant === "legacy" ? "desktop-card" : normalizedVariant;
  const isCompactVariant = normalizedVariant === "studio";
  const copy = isCompactVariant ? COMPACT_COPY : FULL_COPY;

  useEffect(() => {
    return () => {
      rewardSpinTweenRef.current?.kill();
    };
  }, []);

  const isMobileProject = leadData.projectType === "Application mobile";
  const branchStep = isMobileProject ? "appPlatform" : "websiteType";
  const branchValue = isMobileProject
    ? leadData.appPlatform
    : leadData.websiteType;
  const timelineOptions = isMobileProject
    ? MOBILE_TIMELINE_OPTIONS
    : WEBSITE_TIMELINE_OPTIONS;
  const isRewardDrawMode = step === "reward" && hasSpun;
  const isPostRewardFlow = hasSpun && step !== "reward";
  const shouldShowFormIntro = !hasSpun;
  const shouldShowProgress = !isRewardDrawMode;
  const progressByStep = {
    reward: hasSpun ? 18 : 8,
    email: 26,
    projectType: 42,
    websiteType: 58,
    appPlatform: 58,
    budget: 74,
    timeline: 88,
    recap: 100,
    submitted: 100,
  };
  const progress = progressByStep[step] ?? 8;

  const updateLeadData = (field, value) => {
    setLeadData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleRewardSpin = contextSafe(() => {
    if (hasSpun || isSpinning) {
      return;
    }

    const selectedReward = pickWeightedReward();
    const targetRotation = getRewardTargetRotation(selectedReward);

    rewardSpinTweenRef.current?.kill();
    setHasSpun(true);
    setPendingReward(selectedReward);
    setIsSpinning(true);
    setReward("");

    if (reducedMotion || !rewardWheelRef.current) {
      if (rewardWheelRef.current) {
        gsap.set(rewardWheelRef.current, {
          rotation: targetRotation,
          transformOrigin: "50% 50%",
        });
      }

      setReward(selectedReward);
      setPendingReward("");
      setIsSpinning(false);
      return;
    }

    gsap.set(rewardWheelRef.current, {
      rotation: 0,
      transformOrigin: "50% 50%",
    });

    rewardSpinTweenRef.current = gsap.to(rewardWheelRef.current, {
      rotation: targetRotation,
      duration: REWARD_SPIN_DURATION,
      ease: "power4.out",
      transformOrigin: "50% 50%",
      overwrite: true,
      onComplete: () => {
        setReward(selectedReward);
        setPendingReward("");
        setIsSpinning(false);
        rewardSpinTweenRef.current = null;
      },
    });
  });

  const handleRewardContinue = () => {
    if (reward) {
      setStep("email");
    }
  };

  const handleEmailSubmit = (event) => {
    event.preventDefault();

    if (!isValidEmail(leadData.email)) {
      setEmailError("Indiquez un email valide pour continuer.");
      return;
    }

    setEmailError("");
    setStep("projectType");
  };

  const handleProjectTypeChange = (projectType) => {
    setLeadData((current) => ({
      ...current,
      projectType,
      websiteType: projectType === "Site internet" ? current.websiteType : "",
      appPlatform:
        projectType === "Application mobile" ? current.appPlatform : "",
      budget: "",
      timeline: "",
    }));
  };

  const goBack = () => {
    if (step === "email") {
      setStep("reward");
      return;
    }

    if (step === "projectType") {
      setStep("email");
      return;
    }

    if (step === "websiteType" || step === "appPlatform") {
      setStep("projectType");
      return;
    }

    if (step === "budget") {
      setStep(branchStep);
      return;
    }

    if (step === "timeline") {
      setStep("budget");
      return;
    }

    if (step === "recap") {
      setStep("timeline");
    }
  };

  const handleSubmitLead = () => {
    const payload = {
      email: leadData.email.trim(),
      projectType: leadData.projectType,
      websiteType:
        leadData.projectType === "Site internet" ? leadData.websiteType : "",
      appPlatform:
        leadData.projectType === "Application mobile"
          ? leadData.appPlatform
          : "",
      budget: leadData.budget,
      timeline: leadData.timeline,
      reward,
      createdAt: new Date().toISOString(),
    };

    setSubmittedPayload(payload);
    onSubmit?.(payload);
    setStep("submitted");
  };

  const summaryItems = [
    ["Email", leadData.email.trim()],
    ["Projet", leadData.projectType],
    [isMobileProject ? "Plateforme" : "Type", branchValue],
    ["Budget", leadData.budget],
    ["Délai", leadData.timeline],
    ["Bonus", reward],
  ].filter(([, value]) => Boolean(value));

  const renderStep = () => {
    if (step === "reward") {
      const isRewardActionHidden = hasSpun && !reward;
      const rewardActionLabel =
        reward || isRewardActionHidden
          ? "Continuer ma demande"
          : isCompactVariant
            ? "Je demande ma maquette offerte"
            : "Tenter ma chance";

      return (
        <div
          className={`lead-step lead-step--reward${hasSpun ? " is-playing" : ""}${
            reward ? " is-complete" : ""
          }`}
        >
          <div className="lead-step-heading lead-step-heading--reward">
            <h3>{copy.reward}</h3>
          </div>

          <div
            className={`lead-reward-stage${hasSpun ? " is-expanded" : ""}${
              reward ? " is-revealed" : ""
            }${isSpinning ? " is-spinning" : ""}`}
            aria-live="polite"
            aria-busy={isSpinning}
          >
            <LeadRewardWheel
              wheelRef={rewardWheelRef}
              isSpinning={isSpinning}
              showCelebration={Boolean(reward) && !reducedMotion}
            />
            {hasSpun || reward ? (
              <motion.div
                className={`lead-reward-result${reward ? "" : " is-empty"}`}
                key={
                  reward || pendingReward || "mockup-lead-reward-placeholder"
                }
                initial={reducedMotion || !reward ? false : { opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reducedMotion || !reward
                    ? INSTANT_TRANSITION
                    : { duration: 0.22, ease: [0.4, 0, 0.2, 1] }
                }
                aria-hidden={reward ? undefined : "true"}
              >
                {reward ? (
                  <>
                    <span>Bonus débloqué</span>
                    <strong>{reward}</strong>
                  </>
                ) : null}
              </motion.div>
            ) : null}
          </div>

          <div className="lead-actions lead-actions--reward">
            <button
              className={`lead-primary-button${
                isRewardActionHidden ? " is-hidden" : ""
              }`}
              type="button"
              onClick={reward ? handleRewardContinue : handleRewardSpin}
              aria-hidden={isRewardActionHidden ? "true" : undefined}
              tabIndex={isRewardActionHidden ? -1 : undefined}
            >
              {rewardActionLabel}
            </button>
          </div>
        </div>
      );
    }

    if (step === "email") {
      return (
        <form className="lead-step" onSubmit={handleEmailSubmit} noValidate>
          <div className="lead-step-heading">
            <h3>Votre email</h3>
            <p>{copy.email}</p>
          </div>

          <label className="lead-field">
            <span>Email</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={leadData.email}
              onChange={(event) => {
                updateLeadData("email", event.target.value);
                if (emailError) {
                  setEmailError("");
                }
              }}
              placeholder="vous@entreprise.ch"
              aria-invalid={Boolean(emailError)}
            />
          </label>

          {emailError ? (
            <p className="lead-error" role="alert">
              {emailError}
            </p>
          ) : null}

          <div className="lead-actions">
            <button
              className="lead-secondary-button"
              type="button"
              onClick={goBack}
            >
              Retour
            </button>
            <button className="lead-primary-button" type="submit">
              Continuer
            </button>
          </div>
        </form>
      );
    }

    if (step === "projectType") {
      return (
        <LeadChoiceStep
          title="Quel projet souhaitez-vous lancer ?"
          options={PROJECT_TYPE_OPTIONS}
          value={leadData.projectType}
          onSelect={handleProjectTypeChange}
          onBack={goBack}
          onAdvance={setStep}
          nextStep={(selectedProjectType) =>
            selectedProjectType === "Application mobile"
              ? "appPlatform"
              : "websiteType"
          }
          optionLayout="two"
          autoAdvanceDelay={
            reducedMotion ? 0 : CHOICE_AUTO_ADVANCE_DELAY_MS
          }
        />
      );
    }

    if (step === "websiteType") {
      return (
        <LeadChoiceStep
          title="Type de site"
          options={WEBSITE_TYPE_OPTIONS}
          value={leadData.websiteType}
          onSelect={(value) => updateLeadData("websiteType", value)}
          onBack={goBack}
          onAdvance={setStep}
          nextStep="budget"
          optionLayout="two"
          autoAdvanceDelay={
            reducedMotion ? 0 : CHOICE_AUTO_ADVANCE_DELAY_MS
          }
        />
      );
    }

    if (step === "appPlatform") {
      return (
        <LeadChoiceStep
          title="Plateforme"
          options={APP_PLATFORM_OPTIONS}
          value={leadData.appPlatform}
          onSelect={(value) => updateLeadData("appPlatform", value)}
          onBack={goBack}
          onAdvance={setStep}
          nextStep="budget"
          optionLayout="three"
          autoAdvanceDelay={
            reducedMotion ? 0 : CHOICE_AUTO_ADVANCE_DELAY_MS
          }
        />
      );
    }

    if (step === "budget") {
      return (
        <LeadChoiceStep
          title="Budget"
          options={BUDGET_OPTIONS}
          value={leadData.budget}
          onSelect={(value) => updateLeadData("budget", value)}
          onBack={goBack}
          onAdvance={setStep}
          nextStep="timeline"
          optionLayout="balanced"
          autoAdvanceDelay={
            reducedMotion ? 0 : CHOICE_AUTO_ADVANCE_DELAY_MS
          }
        />
      );
    }

    if (step === "timeline") {
      return (
        <LeadChoiceStep
          title="Délai souhaité"
          options={timelineOptions}
          value={leadData.timeline}
          onSelect={(value) => updateLeadData("timeline", value)}
          onBack={goBack}
          onAdvance={setStep}
          nextStep="recap"
          optionLayout="balanced"
          autoAdvanceDelay={
            reducedMotion ? 0 : CHOICE_AUTO_ADVANCE_DELAY_MS
          }
        />
      );
    }

    if (step === "submitted") {
      return (
        <div className="lead-step lead-step--submitted" aria-live="polite">
          <div className="lead-submit-confirmation">
            <div className="lead-submit-mark" aria-hidden="true">
              <span className="lead-submit-spinner" />
              <svg
                className="lead-submit-check"
                viewBox="0 0 28 28"
                focusable="false"
              >
                <path d="M7.5 14.7l4.1 4.1 8.9-9.6" />
              </svg>
            </div>
          </div>
          <div className="lead-step-heading lead-step-heading--submitted">
            <h3>Merci beaucoup, votre demande a été envoyée.</h3>
            <p>{copy.final}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="lead-step lead-step--recap">
        <div className="lead-step-heading">
          <h3>Votre demande est prête.</h3>
          <p>{copy.final}</p>
        </div>

        <dl className="lead-recap-list">
          {summaryItems.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="lead-actions">
          <button
            className="lead-secondary-button"
            type="button"
            onClick={goBack}
          >
            Retour
          </button>
          <button
            className="lead-primary-button"
            type="button"
            onClick={handleSubmitLead}
          >
            Envoyer la demande
          </button>
        </div>
      </div>
    );
  };

  const rootClassName = [
    "hero-form-card",
    `hero-form-card--${cardVariant}`,
    "mockup-lead-form",
    `mockup-lead-form--${normalizedVariant}`,
    isRewardDrawMode ? "is-reward-draw-mode" : "",
    isPostRewardFlow ? "is-post-reward-flow" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={rootClassName}
      data-form-variant={normalizedVariant}
      ref={formRef}
    >
      {shouldShowFormIntro ? (
        <div className="hero-form-intro">
          <h2>Remplissez le formulaire pour recevoir votre maquette offerte</h2>
          <p>{copy.intro}</p>
        </div>
      ) : null}

      {shouldShowProgress ? (
        <div
          className={`lead-progress${
            shouldShowFormIntro ? "" : " lead-progress--solo"
          }`}
          aria-hidden="true"
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="lead-step-frame"
          key={step}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={
            reducedMotion
              ? INSTANT_TRANSITION
              : { duration: 0.28, ease: [0.4, 0, 0.2, 1] }
          }
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default MockupLeadForm;
