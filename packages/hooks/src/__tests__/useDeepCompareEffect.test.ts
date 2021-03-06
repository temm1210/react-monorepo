import { renderHook } from "@testing-library/react";
import { useEffect } from "react";
import useDeepCompareEffect from "../useDeepCompareEffect";

let option = {
  id: 1,
};

const mockEffectNormal = jest.fn();
const mockEffectDeep = jest.fn();

describe("useDeepCompareEffect", () => {
  it("object의 값이 변하지 않으면 무조건 한번 호출되어야 한다.", () => {
    const { rerender: renderEffect } = renderHook(() => useEffect(mockEffectNormal, [option]));
    const { rerender: renderEffectDeep } = renderHook(() => useDeepCompareEffect(mockEffectDeep, [option]));

    expect(mockEffectNormal).toHaveBeenCalledTimes(1);
    expect(mockEffectDeep).toHaveBeenCalledTimes(1);

    option = { id: 1 };
    renderEffect();
    renderEffectDeep();

    expect(mockEffectNormal).toHaveBeenCalledTimes(2);
    expect(mockEffectDeep).toHaveBeenCalledTimes(1);
  });

  it("object의 값이 변하면 다시 호출되어야 한다.", () => {
    const { rerender: renderEffect } = renderHook(() => useEffect(mockEffectNormal, [option]));
    const { rerender: renderEffectDeep } = renderHook(() => useDeepCompareEffect(mockEffectDeep, [option]));

    expect(mockEffectNormal).toHaveBeenCalledTimes(1);
    expect(mockEffectDeep).toHaveBeenCalledTimes(1);

    option = { id: 2 };
    renderEffect();
    renderEffectDeep();

    expect(mockEffectNormal).toHaveBeenCalledTimes(2);
    expect(mockEffectDeep).toHaveBeenCalledTimes(2);
  });
  it("dependency list에 원시타입만 있을경우 error를 발생시킨다.", () => {
    const dependencyString = "string";
    const dependencyNumber = 1;

    expect(() =>
      renderHook(() => useDeepCompareEffect(mockEffectDeep, [dependencyString, dependencyNumber])),
    ).toThrowError(
      "'useDeepCompareEffect' should not be used with primitive dependencies. Use not primitive dependencies.",
    );
  });
});
