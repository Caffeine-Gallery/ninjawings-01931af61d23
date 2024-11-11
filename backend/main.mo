import Nat "mo:base/Nat";

actor {
  stable var high_score : Nat = 0;

  public query func get_high_score() : async Nat {
    high_score
  };

  public func set_high_score(score : Nat) : async Nat {
    if (score > high_score) {
      high_score := score;
    };
    return high_score;
  };
}
