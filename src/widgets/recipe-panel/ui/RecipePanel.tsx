import type { BurgerRecipe, IngredientType } from "../../../shared/types";
import { INGREDIENT_LABELS } from "../../../entities/burger/data/burgers";
import IngredientSVG from "../../../entities/burger/ui/IngredientSVG";

export default function RecipePanel({ recipe }: { recipe: BurgerRecipe }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-4 h-full flex flex-col">
      <div className="text-center mb-3">
        <h3 className="text-xl font-black text-gray-800">{recipe.name}</h3>
        <p className="text-sm text-gray-400 mt-0.5 whitespace-pre-line">
          {recipe.description}
        </p>
      </div>

      <div className="flex-1 flex flex-col-reverse items-center justify-end">
        {recipe.sequence.map((type: IngredientType, i: number) => (
          <div
            key={i}
            className="relative group flex justify-center rounded-xl transition-all"
            style={{ marginBottom: i === 0 ? 0 : type === "top_bun" ? 0 : -10 }}
          >
            <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-4 group-hover:ring-amber-400 group-hover:ring-offset-1 transition-all pointer-events-none z-10" />
            <IngredientSVG type={type} width={224} />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-4 py-2 bg-gray-800 text-white text-lg font-black rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-lg">
              {INGREDIENT_LABELS[type]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
