export const Frequency = {
    RARELY: "Rarely",
    OCCASIONALLY: "Occasionally",
    REGULARLY: "Regularly",
    FREQUENTLY: "Frequently",
    EVERYDAY: "Everyday"
}

export const Level = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
    PRO: "Pro",
    EXPERT: "Expert"
}

export function getFrequencyValue(frequency){
    switch(frequency){
        case "Rarely":
            return 1
        case "Occasionally":
            return 2
        case "Regularly":
            return 3
        case "Frequently":
            return 4
        case "Everyday":
            return 5    
        default:
            return 0
    }
}

export function getLevelValue(level){
    switch(level){
        case "Beginner":
            return 1
        case "Intermediate":
            return 2
        case "Advanced":
            return 3
        case "Pro":
            return 4
        case "Expert":
            return 5    
        default:
            return 0
    }
}

export function orderInterestsList(list){
    list.sort(compareInterests)    
}

export function compareInterests(item1,item2){
    if(getLevelValue(item1.level) + getFrequencyValue(item1.frequency) < getLevelValue(item2.level) + getFrequencyValue(item2.frequency)){
        return 1
    }
    if(getLevelValue(item1.level) + getFrequencyValue(item1.frequency) > getLevelValue(item2.level) + getFrequencyValue(item2.frequency)){
        return -1
    }
    if(getLevelValue(item1.level) + getFrequencyValue(item1.frequency) === getLevelValue(item2.level) + getFrequencyValue(item2.frequency)){
        return 0
    }
    
}