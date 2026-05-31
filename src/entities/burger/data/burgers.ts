import type { BurgerRecipe, IngredientType } from "../../../shared/types";

export const BURGERS: BurgerRecipe[] = [
  {
    id: "basic",
    name: "기본 버거",
    emoji: "🍔",
    description: "가장 기본적인 버거예요!",
    sequence: ["bottom_bun", "patty", "top_bun"],
    availableIngredients: ["bottom_bun", "patty", "top_bun", "lettuce"],
    rules: []
  },
  {
    id: "cheese",
    name: "치즈버거",
    emoji: "🧀",
    description: "치즈가 들어간 버거예요!",
    sequence: [
      "bottom_bun",
      "ketchup",
      "lettuce",
      "patty",
      "cheese",
      "top_bun"
    ],
    availableIngredients: [
      "bottom_bun",
      "ketchup",
      "lettuce",
      "patty",
      "cheese",
      "top_bun",
      "tomato"
    ],
    rules: []
  },
  {
    id: "bulgogi",
    name: "불고기 버거",
    emoji: "🥩",
    description: "달콤한 불고기가 들어간 버거예요!",
    sequence: [
      "bottom_bun",
      "bulgogi_sauce",
      "lettuce",
      "patty",
      "onion",
      "top_bun"
    ],
    availableIngredients: [
      "bottom_bun",
      "bulgogi_sauce",
      "lettuce",
      "patty",
      "onion",
      "top_bun",
      "tomato"
    ],
    rules: []
  },
  {
    id: "bacon",
    name: "베이컨 버거",
    emoji: "🥓",
    description: "바삭한 베이컨이 들어간 버거예요!",
    sequence: [
      "bottom_bun",
      "special_sauce",
      "lettuce",
      "patty",
      "bacon",
      "cheese",
      "top_bun"
    ],
    availableIngredients: [
      "bottom_bun",
      "special_sauce",
      "lettuce",
      "patty",
      "bacon",
      "cheese",
      "top_bun",
      "onion"
    ],
    rules: []
  },
  {
    id: "egg",
    name: "에그 버거",
    emoji: "🍳",
    description: "계란 후라이가 올라간 버거예요!",
    sequence: [
      "bottom_bun",
      "special_sauce",
      "lettuce",
      "tomato",
      "patty",
      "egg",
      "top_bun"
    ],
    availableIngredients: [
      "bottom_bun",
      "special_sauce",
      "lettuce",
      "tomato",
      "patty",
      "egg",
      "top_bun",
      "cheese"
    ],
    rules: []
  },
  {
    id: "special",
    name: "스페셜 버거",
    emoji: "⭐",
    description: "모든 재료가 들어간 특별한 버거예요!",
    sequence: [
      "bottom_bun",
      "special_sauce",
      "lettuce",
      "tomato",
      "patty",
      "cheese",
      "bacon",
      "onion",
      "top_bun"
    ],
    availableIngredients: [
      "bottom_bun",
      "special_sauce",
      "lettuce",
      "tomato",
      "patty",
      "cheese",
      "bacon",
      "onion",
      "top_bun",
      "egg"
    ],
    rules: []
  },

  // ── 디버그 스테이지 ──────────────────────────────────────────────
  {
    id: "debug_extra_basic",
    name: "재료가 너무 많은 버거",
    emoji: "🐛",
    description: "필요없는 재료가 들어가 있어요.\n찾아서 빼봐요!",
    sequence: ["bottom_bun", "patty", "top_bun"],
    availableIngredients: ["bottom_bun", "patty", "top_bun", "lettuce"],
    rules: [],
    isDebug: true,
    initialSequence: ["bottom_bun", "lettuce", "patty", "top_bun"]
  },
  {
    id: "debug_flip",
    name: "뒤집힌 기본 버거",
    emoji: "🐛",
    description: "어? 빵이 위아래가 바뀐 것 같아요!\n순서를 고쳐봐요.",
    sequence: ["bottom_bun", "patty", "top_bun"],
    availableIngredients: ["bottom_bun", "patty", "top_bun"],
    rules: [],
    isDebug: true,
    initialSequence: ["top_bun", "patty", "bottom_bun"]
  },
  {
    id: "debug_swap",
    name: "순서가 꼬인 치즈버거",
    emoji: "🐛",
    description: "재료 두 개의 순서가 뒤바뀌었어요.\n찾아서 고쳐봐요!",
    sequence: [
      "bottom_bun",
      "ketchup",
      "lettuce",
      "patty",
      "cheese",
      "top_bun"
    ],
    availableIngredients: [
      "bottom_bun",
      "ketchup",
      "lettuce",
      "patty",
      "cheese",
      "top_bun"
    ],
    rules: [],
    isDebug: true,
    initialSequence: [
      "bottom_bun",
      "lettuce",
      "ketchup",
      "patty",
      "cheese",
      "top_bun"
    ]
  },
  {
    id: "debug_extra",
    name: "이상한 재료가 들어간 버거",
    emoji: "🐛",
    description: "필요없는 재료가 들어가 있어요.\n찾아서 빼봐요!",
    sequence: [
      "bottom_bun",
      "bulgogi_sauce",
      "lettuce",
      "patty",
      "onion",
      "top_bun"
    ],
    availableIngredients: [
      "bottom_bun",
      "bulgogi_sauce",
      "lettuce",
      "patty",
      "onion",
      "top_bun",
      "tomato"
    ],
    rules: [],
    isDebug: true,
    initialSequence: [
      "bottom_bun",
      "bulgogi_sauce",
      "tomato",
      "lettuce",
      "patty",
      "onion",
      "top_bun"
    ]
  },
  {
    id: "debug_missing",
    name: "재료가 빠진 버거",
    emoji: "🐛",
    description: "재료가 하나 빠진 것 같아요.\n알맞은 위치에 넣어봐요!",
    sequence: [
      "bottom_bun",
      "special_sauce",
      "lettuce",
      "tomato",
      "patty",
      "egg",
      "top_bun"
    ],
    availableIngredients: [
      "bottom_bun",
      "special_sauce",
      "lettuce",
      "tomato",
      "patty",
      "egg",
      "top_bun"
    ],
    rules: [],
    isDebug: true,
    initialSequence: [
      "bottom_bun",
      "special_sauce",
      "tomato",
      "patty",
      "egg",
      "top_bun"
    ]
  }
];

export const INGREDIENT_LABELS: Record<IngredientType, string> = {
  bottom_bun: "🍞 아래 빵",
  top_bun: "🎩 윗 빵",
  patty: "🥩 패티",
  cheese: "🧀 치즈",
  lettuce: "🥬 상추",
  tomato: "🍅 토마토",
  onion: "🧅 양파",
  bulgogi_sauce: "🍯 불고기 소스",
  ketchup: "🥫 케첩",
  special_sauce: "⭐ 스페셜 소스",
  bacon: "🥓 베이컨",
  egg: "🍳 계란"
};

export const INGREDIENT_EMOJIS: Record<IngredientType, string> = {
  bottom_bun: "🍞",
  top_bun: "🎩",
  patty: "🥩",
  cheese: "🧀",
  lettuce: "🥬",
  tomato: "🍅",
  onion: "🧅",
  bulgogi_sauce: "🍯",
  ketchup: "🥫",
  special_sauce: "⭐",
  bacon: "🥓",
  egg: "🍳"
};

export const BLOCK_LABELS: Record<IngredientType, string> = {
  bottom_bun: "🍞 아래 빵 놓기",
  top_bun: "🎩 윗 빵 덮기",
  patty: "🥩 패티 올리기",
  cheese: "🧀 치즈 올리기",
  lettuce: "🥬 상추 올리기",
  tomato: "🍅 토마토 올리기",
  onion: "🧅 양파 올리기",
  bulgogi_sauce: "🍯 불고기 소스 바르기",
  ketchup: "🥫 케첩 바르기",
  special_sauce: "⭐ 스페셜 소스 바르기",
  bacon: "🥓 베이컨 올리기",
  egg: "🍳 계란 올리기"
};
