var Schema = {};

Schema.createSchema = mongoose => {
    var ReportSchema = mongoose.Schema({
        telephone: {
            type: String,
            required: true,
            'default': ''
        },
        position: {
            x: {
                type: Number,
                required: true,
                'default': ''
            },
            y: {
                type: Number, 
                required: true,
                'default': ''
            }
        },
        danger: {
            type: Boolean,
            required: true,
            'default': true
        },
        report_at: {
            type: Date,
            unique: false,
            'default': Date.now
        }
    });

    return ReportSchema;
}

module.exports = Schema;