export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'get_high_score' : IDL.Func([], [IDL.Nat], ['query']),
    'set_high_score' : IDL.Func([IDL.Nat], [IDL.Nat], []),
  });
};
export const init = ({ IDL }) => { return []; };
